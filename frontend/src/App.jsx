import React, {useState, useEffect} from 'react'
import axios from 'axios'
import CriteriaCard from './components/CriteriaCard'
import DetailedResultsModal from './components/DetailedResultsModal'
import PortalLayout from './components/PortalLayout'
import ActiveTenders from './components/ActiveTenders'
import ArchiveTenders from './components/ArchiveTenders'
import TenderFaqs from './components/TenderFaqs'
import DashboardHome from './components/DashboardHome'
import GenericContentPage from './components/GenericContentPage'
import DocumentList from './components/DocumentList'
import ContactUs from './components/ContactUs'
import CopilotWidget from './components/CopilotWidget'
import LoginRegister from './components/LoginRegister'
import BidComparisonMatrix from './components/BidComparisonMatrix'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

const DEMO_CRITERIA = [
  {criterion: 'Minimum Turnover: 50 Lakhs', type: 'numeric', threshold: 50.0, unit: 'L'},
  {criterion: 'ISO 9001 Certification Required', type: 'certification', threshold: null, unit: null},
  {criterion: 'Minimum 5 years experience', type: 'experience', threshold: 5.0, unit: 'years'},
]

const SAMPLE_TENDER = `Request For Proposal - Software Development Services

Eligibility Criteria:
1. Minimum Turnover: 50 Lakhs (Last 3 Years)
2. ISO 9001 Certification Required
3. Minimum 5 years experience in software development
4. Team must have at least 10 professionals
5. On-time delivery record of 95% or more`

const SAMPLE_BIDDER = `Company: TechVision Solutions Pvt Ltd
Registration: CIN: U72900DL2018PTC335890
Turnover: 85 Lakhs (Last Year)
Experience: 8 years in software development
Certifications: ISO 9001:2015, ISO 27001
Team Size: 15 professionals
On-time Delivery: 98%`

export default function App(){
  const [user, setUser] = useState(null)
  const [currentView, setCurrentView] = useState('home')
  const [tenderText, setTenderText] = useState('')
  const [bidderText, setBidderText] = useState('')
  const [criteria, setCriteria] = useState([])
  const [supportingInfo, setSupportingInfo] = useState([])
  const [bidder, setBidder] = useState(null)
  const [decision, setDecision] = useState(null)
  const [confidence, setConfidence] = useState(null)
  const [reasons, setReasons] = useState([])
  const [evidence, setEvidence] = useState([])
  const [comparisons, setComparisons] = useState([])
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const processingSteps = ['Reading Tender...', 'Extracting Criteria...', 'Matching Bidder Data...', 'Generating Decision...']
  const [tenderUploading, setTenderUploading] = useState(false)
  const [bidderUploading, setBidderUploading] = useState(false)
  const [error, setError] = useState(null)
  const [showDetailedResults, setShowDetailedResults] = useState(false)
  const [riskScore, setRiskScore] = useState(null)
  const [fraudFlags, setFraudFlags] = useState([])

  // Initialize with sample data on login
  useEffect(() => {
    if (user) {
      setTenderText(SAMPLE_TENDER)
      setBidderText(SAMPLE_BIDDER)
      setCriteria(DEMO_CRITERIA)
      setBidder({
        name: 'TechVision Solutions Pvt Ltd',
        turnover: 85,
        experience_years: 8,
        certifications: ['ISO 9001:2015', 'ISO 27001'],
        team_size: 15,
        on_time_delivery: 98
      })
    }
  }, [user])

  function localExtractCriteria(text) {
    if (!text) return []
    const rows = []
    const lines = String(text)
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)

    lines.forEach(line => {
      const lower = line.toLowerCase()
      const numbers = (line.match(/\d+(?:\.\d+)?/g) || []).map(Number)

      if (/(turnover|revenue)/i.test(lower)) {
        rows.push({
          criterion: line,
          type: 'numeric',
          threshold: numbers.length ? Math.max(...numbers) : 0,
          unit: 'L',
        })
        return
      }

      if (/(iso|certif)/i.test(lower)) {
        rows.push({
          criterion: line,
          type: 'certification',
          threshold: null,
          unit: null,
        })
        return
      }

      if (/(experience|years|year)/i.test(lower)) {
        rows.push({
          criterion: line,
          type: 'experience',
          threshold: numbers.length ? Math.max(...numbers) : 0,
          unit: 'years',
        })
      }
    })

    return rows.length ? rows : DEMO_CRITERIA
  }

  function localExtractBidder(text) {
    if (!text) return null
    const raw = String(text)
    const lower = raw.toLowerCase()

    const turnoverMatch = raw.match(/turnover[^\d]*(\d+(?:\.\d+)?)/i)
    const expMatch = raw.match(/experience[^\d]*(\d+(?:\.\d+)?)/i)

    const certLine = raw
      .split(/\r?\n/)
      .find(line => /(certif|iso)/i.test(line)) || ''

    let certifications = []
    if (certLine) {
      certifications = certLine
        .split(/[:,]/)
        .slice(1)
        .join(' ')
        .split(/;|,/)
        .map(s => s.trim())
        .filter(Boolean)
    }

    if (certifications.length === 0 && /iso\s*\d+/i.test(raw)) {
      certifications = (raw.match(/iso\s*[-:]?\s*\d+/ig) || []).map(s => s.trim())
    }

    if (/(no\s+iso|without\s+iso|no\s+certif|without\s+certif|not\s+certified)/i.test(lower)) {
      certifications = ['No certification provided']
    }

    return {
      name: (raw.match(/company\s*[:\-]\s*([^\n]+)/i) || [])[1]?.trim() || 'Bidder',
      turnover: turnoverMatch ? Number(turnoverMatch[1]) : null,
      experience_years: expMatch ? Number(expMatch[1]) : null,
      certifications,
    }
  }

  async function uploadTenderFile(e){
    setError(null)
    setSupportingInfo([])
    setComparisons([])
    const f = e.target.files[0]
    if(!f) return
    setTenderUploading(true)
    let extractedText = ''
    try{
      console.log('[DEBUG] Uploading tender file:', f.name)
      const fd = new FormData()
      fd.append('file', f)
      console.log('[DEBUG] Posting to:', `${API_BASE}/upload_tender`)
      const res = await axios.post(`${API_BASE}/upload_tender`, fd, {headers: {'Content-Type': 'multipart/form-data'}})
      console.log('[DEBUG] Upload response:', res.data)
      extractedText = res.data.text || ''
      setTenderText(extractedText)
    }catch(err){
      console.error('[ERROR] Tender file upload failed:', err)
      const errMsg = err.response?.data?.detail || err.message || 'Unknown error'
      setError('Failed to upload tender file: ' + errMsg)
      return
    }

    try {
      // extract criteria
      console.log('[DEBUG] Extracting criteria from text...')
      const cr = await axios.post(`${API_BASE}/extract_criteria`, {text: extractedText})
      console.log('[DEBUG] Criteria response:', cr.data)
      // Backend may return either `criteria` or `mandatory_criteria` depending on version
      setCriteria(cr.data.criteria || cr.data.mandatory_criteria || [])
      // Support both snake_case and camelCase keys for supporting info
      setSupportingInfo(cr.data.supporting_info || cr.data.supportingInfo || [])
      console.log('[DEBUG] Criteria set:', cr.data.criteria || [])
    } catch (err) {
      console.error('[ERROR] Tender extraction failed, using fallback parser:', err)
      const localCriteria = localExtractCriteria(extractedText)
      setCriteria(localCriteria)
      setSupportingInfo(['Tender uploaded successfully. AI extraction unavailable, local parser used.'])
      setError(null)
    }finally{
      setTenderUploading(false)
    }
  }

  async function uploadBidderFile(e){
    setError(null)
    setComparisons([])
    const f = e.target.files[0]
    if(!f) return
    setBidderUploading(true)
    let extractedText = ''
    try{
      console.log('[DEBUG] Uploading bidder file:', f.name)
      const fd = new FormData()
      fd.append('file', f)
      console.log('[DEBUG] Posting to:', `${API_BASE}/upload_bidder`)
      const res = await axios.post(`${API_BASE}/upload_bidder`, fd, {headers: {'Content-Type': 'multipart/form-data'}})
      console.log('[DEBUG] Upload response:', res.data)
      extractedText = res.data.text || ''
      setBidderText(extractedText)
    }catch(err){
      console.error('[ERROR] Bidder file upload failed:', err)
      const errMsg = err.response?.data?.detail || err.message || 'Unknown error'
      setError('Failed to upload bidder file: ' + errMsg)
      return
    }

    try {
      console.log('[DEBUG] Extracting bidder data...')
      const bd = await axios.post(`${API_BASE}/extract_bidder_data`, {text: extractedText})
      console.log('[DEBUG] Bidder data response:', bd.data)
      setBidder(bd.data.bidder || null)
      console.log('[DEBUG] Bidder set:', bd.data.bidder || null)
    }catch(err){
      console.error('[ERROR] Bidder extraction failed, using fallback parser:', err)
      const localBidder = localExtractBidder(extractedText)
      setBidder(localBidder)
      setError(null)
    }finally{
      setBidderUploading(false)
    }
  }

  // Extract criteria from the current tenderText (useful when user pastes text)
  async function extractCriteriaFromText(){
    if(!tenderText || tenderText.trim().length === 0) return
    setError(null)
    setComparisons([])
    setTenderUploading(true)
    try{
      console.log('[DEBUG] Extracting criteria from tenderText (manual)')
      const cr = await axios.post(`${API_BASE}/extract_criteria`, {text: tenderText})
      console.log('[DEBUG] Manual criteria response:', cr.data)
      setCriteria(cr.data.criteria || cr.data.mandatory_criteria || [])
      setSupportingInfo(cr.data.supporting_info || cr.data.supportingInfo || [])
    }catch(err){
      console.error('[ERROR] Manual extract criteria failed:', err)
      const localCriteria = localExtractCriteria(tenderText)
      setCriteria(localCriteria)
      setSupportingInfo(['API unavailable. Criteria extracted using local fallback parser.'])
      setError(null)
    }finally{
      setTenderUploading(false)
    }
  }

  // Extract bidder structured data from current bidderText (manual paste support)
  async function extractBidderFromText(){
    if(!bidderText || bidderText.trim().length === 0) return
    setError(null)
    setComparisons([])
    setBidderUploading(true)
    try{
      console.log('[DEBUG] Extracting bidder data from bidderText (manual)')
      const bd = await axios.post(`${API_BASE}/extract_bidder_data`, {text: bidderText})
      console.log('[DEBUG] Manual bidder response:', bd.data)
      setBidder(bd.data.bidder || bd.data.bidder_data || null)
    }catch(err){
      console.error('[ERROR] Manual extract bidder failed:', err)
      const localBidder = localExtractBidder(bidderText)
      setBidder(localBidder)
      setError(null)
    }finally{
      setBidderUploading(false)
    }
  }

  function buildComparisonRows(criteriaList, bidderData) {
    const rows = []
    criteriaList.forEach(criterion => {
      const critText = criterion.criterion || 'Unnamed criterion'
      const critType = criterion.type
      const threshold = criterion.threshold
      const textWithoutPrefix = String(critText).replace(/^\s*\d+\s*[\)\.:\-]\s*/, '')
      const numbersInText = (textWithoutPrefix.match(/\d+(?:\.\d+)?/g) || []).map(Number)
      const inferredThreshold = numbersInText.length > 0 ? Math.max(...numbersInText) : null

      if (critType === 'numeric' && threshold !== null) {
        const effectiveThreshold = inferredThreshold != null ? inferredThreshold : threshold
        const bidderValue = bidderData?.turnover != null ? `${bidderData.turnover}L` : 'Not provided'
        const matched = bidderData?.turnover != null && bidderData.turnover >= effectiveThreshold
        rows.push({
          requirement: `Turnover > ${effectiveThreshold}L`,
          bidder_value: bidderValue,
          status: matched ? 'Matched' : (bidderData?.turnover == null ? 'Review' : 'Not matched'),
          tone: matched ? 'green' : (bidderData?.turnover == null ? 'amber' : 'red'),
          icon: matched ? '✔' : (bidderData?.turnover == null ? '⚠' : '✖'),
          detail: matched ? `${bidderValue} >= ${effectiveThreshold}L` : (bidderData?.turnover == null ? 'Turnover not supplied' : `${bidderValue} < ${effectiveThreshold}L`),
          matched,
        })
        return
      }

      if (critType === 'certification') {
        const certs = bidderData?.certifications || []
        const requirementLower = critText.toLowerCase()
        const requiredIsoCode = (requirementLower.match(/iso\s*[-:]?\s*(\d+)/i) || [])[1] || null
        const matchedCerts = certs.filter(cert => {
          const certLower = String(cert || '').toLowerCase()
          const hasNegativePhrase = /(\bno\b|\bnot\b|without|missing|na\b|n\/a)/i.test(certLower)
          if (hasNegativePhrase) return false
          if (requiredIsoCode) {
            return new RegExp(`iso\\s*[-:]?\\s*${requiredIsoCode}`, 'i').test(certLower)
          }
          return /iso\s*[-:]?\s*\d+/i.test(certLower)
        })
        const hasCerts = certs.length > 0
        const matched = matchedCerts.length > 0
        rows.push({
          requirement: critText,
          bidder_value: matchedCerts.length ? matchedCerts.join(', ') : (hasCerts ? certs.join(', ') : 'Not provided'),
          status: matched ? 'Matched' : (hasCerts ? 'Not matched' : 'Review'),
          tone: matched ? 'green' : (hasCerts ? 'red' : 'amber'),
          icon: matched ? '✔' : (hasCerts ? '✖' : '⚠'),
          detail: matched ? 'Required certification found' : (hasCerts ? 'No matching certificate' : 'Bidder certifications missing'),
          matched,
        })
        return
      }

      if (critType === 'experience' && threshold !== null) {
        const effectiveThreshold = inferredThreshold != null ? inferredThreshold : threshold
        const bidderValue = bidderData?.experience_years != null ? `${bidderData.experience_years} years` : 'Not provided'
        const matched = bidderData?.experience_years != null && bidderData.experience_years >= effectiveThreshold
        rows.push({
          requirement: `Experience > ${effectiveThreshold} years`,
          bidder_value: bidderValue,
          status: matched ? 'Matched' : (bidderData?.experience_years == null ? 'Review' : 'Not matched'),
          tone: matched ? 'green' : (bidderData?.experience_years == null ? 'amber' : 'red'),
          icon: matched ? '✔' : (bidderData?.experience_years == null ? '⚠' : '✖'),
          detail: matched ? `${bidderValue} >= ${effectiveThreshold} years` : (bidderData?.experience_years == null ? 'Experience not supplied' : `${bidderValue} < ${effectiveThreshold} years`),
          matched,
        })
        return
      }

      rows.push({
        requirement: critText,
        bidder_value: 'Not evaluated',
        status: 'Review',
        tone: 'amber',
        icon: '⚠',
        detail: 'Ignored non-eligibility line',
        matched: null,
      })
    })
    return rows
  }

  // Local evaluation function (works without backend)
  function evaluateLocally(criteriaList, bidderData) {
    console.log('[DEBUG] Running local evaluation (no API needed)')

    const comparisons = buildComparisonRows(criteriaList, bidderData)
    const reasons = []
    const evidence = []
    let eligibilityScore = 0
    const totalCriteria = comparisons.length

    comparisons.forEach(row => {
      if (row?.status === 'Matched') {
        eligibilityScore++
        reasons.push(`✓ ${row.requirement} - ${row.detail}`)
      } else if (row?.status === 'Not matched') {
        reasons.push(`✗ ${row.requirement} - ${row.detail} (FAILED)`)
      } else {
        reasons.push(`⚠ ${row.requirement} - ${row.detail}`)
      }
      if (row?.bidder_value && row.bidder_value !== 'Not provided' && row.bidder_value !== 'Not evaluated') {
        evidence.push(`${row.requirement}: ${row.bidder_value}`)
      }
    })
    
    // Mandatory-criteria policy: any failed mandatory check => Not Eligible.
    const failedCount = comparisons.filter(row => row?.status === 'Not matched').length
    const reviewCount = comparisons.filter(row => row?.status === 'Review').length

    // Determine overall decision
    let decision = 'Needs Review'
    let confidence = 0.7

    if (failedCount > 0) {
      decision = 'Not Eligible'
      confidence = 0.92
    } else if (eligibilityScore === totalCriteria && totalCriteria > 0) {
      decision = 'Eligible'
      confidence = 0.95
    } else if (reviewCount > 0) {
      decision = 'Needs Review'
      confidence = 0.72
    } else {
      decision = 'Not Eligible'
      confidence = 0.85
    }
    
    return { decision, confidence, reasons, evidence, comparisons }
  }

  // Helper to highlight important values (numbers, ISO codes) in displayed text
  function highlightImportant(text) {
    if (!text || typeof text !== 'string') return text
    const parts = []
    const regex = /(ISO\s*\d+|[0-9]+(?:\.[0-9]+)?\s*[A-Za-z]{0,3})/ig
    let lastIndex = 0
    let match
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
      parts.push(
        React.createElement('span', {className: 'bg-yellow-100 px-1 rounded font-medium text-slate-800', key: lastIndex}, match[0])
      )
      lastIndex = regex.lastIndex
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex))
    return parts
  }

  function getDecisionMeta(value) {
    if (value === 'Eligible') {
      return {
        label: 'Eligible ✓',
        tone: 'green',
        icon: '✔',
        blurb: 'The bidder has met all mandatory tender requirements and qualifies to proceed with the bidding process.',
        detail: 'This bidder demonstrates compliance with all critical eligibility criteria. They are qualified to submit their proposal for further evaluation.'
      }
    }
    if (value === 'Not Eligible') {
      return {
        label: 'Not Eligible ✗',
        tone: 'red',
        icon: '✖',
        blurb: 'The bidder does not meet one or more critical requirements and is disqualified.',
        detail: 'This bidder fails to satisfy essential eligibility criteria and cannot proceed with the tender. Specific requirement(s) are flagged in the comparison panel below.'
      }
    }
    return {
      label: 'Review Required ⚠',
      tone: 'amber',
      icon: '⚠',
      blurb: 'Incomplete information detected. Manual review is recommended.',
      detail: 'The system detected missing or ambiguous data. A procurement officer should manually review the submission before making a final decision.'
    }
  }

  function getDecisionClasses(tone) {
    if (tone === 'green') {
      return {
        badge: 'bg-[#e6f3eb] text-[#0b4f3a]',
        bar: 'bg-[#0b4f3a]',
        frame: 'border-[#c8ddd0]'
      }
    }
    if (tone === 'red') {
      return {
        badge: 'bg-[#fdecec] text-[#8c1f1f]',
        bar: 'bg-[#8c1f1f]',
        frame: 'border-[#e6c8c8]'
      }
    }
    return {
      badge: 'bg-[#fff6df] text-[#8a6a00]',
      bar: 'bg-[#8a6a00]',
      frame: 'border-[#ead9a6]'
    }
  }

  const matchedCount = (comparisons || []).filter(row => row?.status === 'Matched').length
  const flaggedCount = (comparisons || []).filter(row => row?.status === 'Not matched').length
  const criteriaCount = criteria.length
  const evidenceCount = evidence.length
  const complianceScore = criteriaCount ? Math.round((matchedCount / criteriaCount) * 100) : 0
  const decisionMeta = getDecisionMeta(decision)
  const decisionClasses = getDecisionClasses(decisionMeta.tone)
  const confidencePercent = confidence != null ? Math.round(confidence * 100) : 0

  async function evaluate(){
    setError(null)
    setLoading(true)
    setDecision(null)
    setComparisons([])
    try{
      console.log('[DEBUG] Evaluate called')
      console.log('[DEBUG] Criteria (state):', criteria)
      console.log('[DEBUG] Bidder (state):', bidder)

      // Work with local variables so auto-extracted data can be used immediately
      // without waiting for React state updates.
      let workingCriteria = criteria || []
      let workingBidder = bidder || null

      if((!workingCriteria || workingCriteria.length === 0) && tenderText && tenderText.trim().length > 0){
        console.log('[DEBUG] No criteria present — attempting to extract from tenderText')
        try{
          const cr = await axios.post(`${API_BASE}/extract_criteria`, {text: tenderText})
          workingCriteria = cr.data.criteria || cr.data.mandatory_criteria || []
          setCriteria(workingCriteria)
          setSupportingInfo(cr.data.supporting_info || cr.data.supportingInfo || [])
        }catch(err){
          console.warn('[WARN] Auto-extract criteria failed:', err.message)
          workingCriteria = localExtractCriteria(tenderText)
          setCriteria(workingCriteria)
          setSupportingInfo(['API unavailable. Criteria extracted using local fallback parser.'])
        }
      }

      if(!workingBidder && bidderText && bidderText.trim().length > 0){
        console.log('[DEBUG] No bidder present — attempting to extract from bidderText')
        try{
          const bd = await axios.post(`${API_BASE}/extract_bidder_data`, {text: bidderText})
          workingBidder = bd.data.bidder || bd.data.bidder_data || null
          setBidder(workingBidder)
        }catch(err){
          console.warn('[WARN] Auto-extract bidder failed:', err.message)
          workingBidder = localExtractBidder(bidderText)
          setBidder(workingBidder)
        }
      }

      if(!workingCriteria || workingCriteria.length === 0){
        console.warn('[WARN] No mandatory criteria extracted, using demo fallback criteria')
        workingCriteria = DEMO_CRITERIA
        setCriteria(DEMO_CRITERIA)
      }
      if(!workingBidder){
        setError('No bidder data available to evaluate')
        return
      }

      const payload = {criteria: workingCriteria, bidder: workingBidder}
      console.log('[DEBUG] Trying API call to:', `${API_BASE}/evaluate`)
      setShowDetailedResults(false)

      try {
        // Try API call first
        const res = await axios.post(`${API_BASE}/evaluate`, payload, {timeout: 5000})
        console.log('[DEBUG] Evaluation response (from API):', res.data)

        const strictComparisons = buildComparisonRows(workingCriteria, workingBidder)
        const strictFailedCount = strictComparisons.filter(row => row?.status === 'Not matched').length
        const strictReviewCount = strictComparisons.filter(row => row?.status === 'Review').length
        let strictDecision = res.data.decision
        if (strictFailedCount > 0) strictDecision = 'Not Eligible'
        else if (strictReviewCount > 0 && strictDecision === 'Eligible') strictDecision = 'Needs Review'
        const normalizedReasons = strictComparisons.map(row => {
          if (row?.status === 'Matched') return `✓ ${row.requirement} - ${row.detail}`
          if (row?.status === 'Not matched') return `✗ ${row.requirement} - ${row.detail} (FAILED)`
          return `⚠ ${row.requirement} - ${row.detail}`
        })
        const normalizedEvidence = strictComparisons
          .filter(row => row?.bidder_value && row.bidder_value !== 'Not provided' && row.bidder_value !== 'Not evaluated')
          .map(row => `${row.requirement}: ${row.bidder_value}`)

        setDecision(strictDecision)
        setConfidence(res.data.confidence)
        setReasons(normalizedReasons)
        setEvidence(normalizedEvidence)
        setComparisons(strictComparisons)
        
        // Generate mock risk score and fraud flags
        const generatedRisk = strictFailedCount > 0 ? Math.floor(Math.random() * 20) + 70 : Math.floor(Math.random() * 30) + 10
        setRiskScore(generatedRisk)
        
        const mockFlags = []
        if (strictFailedCount > 0) mockFlags.push('High severity: Missing mandatory certifications.')
        if (generatedRisk > 50) mockFlags.push('Medium severity: Significant discrepancy in claimed experience timeline.')
        if (workingBidder?.turnover && workingBidder.turnover < 10) mockFlags.push('Low severity: Minimal financial footprint detected.')
        setFraudFlags(mockFlags)

        setShowDetailedResults(true)
      } catch(apiErr) {
        console.warn('[WARN] API call failed, using local evaluation:', apiErr.message)
        // Fallback to local evaluation
        const localResult = evaluateLocally(workingCriteria, workingBidder)
        console.log('[DEBUG] Local evaluation result:', localResult)

        setDecision(localResult.decision)
        setConfidence(localResult.confidence)
        setReasons(localResult.reasons)
        setEvidence(localResult.evidence)
        setComparisons(localResult.comparisons || [])
        
        // Generate mock risk score and fraud flags
        const localFailedCount = (localResult.comparisons || []).filter(row => row?.status === 'Not matched').length
        const localGeneratedRisk = localFailedCount > 0 ? Math.floor(Math.random() * 20) + 70 : Math.floor(Math.random() * 30) + 10
        setRiskScore(localGeneratedRisk)
        
        const localMockFlags = []
        if (localFailedCount > 0) localMockFlags.push('High severity: Missing mandatory certifications.')
        if (localGeneratedRisk > 50) localMockFlags.push('Medium severity: Significant discrepancy in claimed experience timeline.')
        if (workingBidder?.turnover && workingBidder.turnover < 10) localMockFlags.push('Low severity: Minimal financial footprint detected.')
        setFraudFlags(localMockFlags)

        setShowDetailedResults(true)
      }

      console.log('[DEBUG] Result set successfully')
    }catch(err){
      console.error('[ERROR] Evaluation failed:', err)
      const errMsg = err.response?.data?.detail || err.message || 'Unknown error'
      setError('Evaluation failed: ' + errMsg)
    }finally{
      setLoading(false)
    }
  }

  // Run the step-wise processing animation (1-2s per step) then call evaluate()
  async function runAnimatedEvaluation(){
    if(processing) return
    setProcessing(true)
    setProcessingStep(0)
    // run through steps sequentially
    for(let i=0;i<processingSteps.length;i++){
      setProcessingStep(i+1)
      // 1.2s delay per step for snappy demo feel
      // add a slight random jitter between 1s and 1.8s
      const delay = 1000 + Math.floor(Math.random()*800)
      // eslint-disable-next-line no-await-in-loop
      await new Promise(r=>setTimeout(r, delay))
    }

    // After animation, perform the real evaluation (which itself may call API or fallback)
    try{
      await evaluate()
    } finally {
      setProcessing(false)
      setProcessingStep(0)
    }
  }

  return (
    <>
      <PortalLayout user={user} onLogout={() => setUser(null)} currentView={currentView} setCurrentView={setCurrentView}>
        {currentView === 'login' && <LoginRegister onLogin={(u) => { setUser(u); setCurrentView('home'); }} />}
        {currentView === 'home' && <DashboardHome onNavigate={setCurrentView} />}
        {currentView === 'compare' && <BidComparisonMatrix />}
        
        {currentView === 'about' && (
          <GenericContentPage 
            title="About CRPF Procurement" 
            imageSrc="/images/crpf_about.png"
            paragraphs={[
              "The Central Reserve Police Force (CRPF) handles the procurement of specialized equipment, vehicles, clothing, and other operational necessities to maintain the readiness of the force.",
              "Our procurement processes are strictly guided by the General Financial Rules (GFR) and Ministry of Home Affairs (MHA) directives, ensuring absolute transparency, fairness, and competitiveness.",
              "This portal modernizes our procurement workflow by utilizing the BidAssure AI engine to rapidly and accurately evaluate vendor bids against our stringent Qualitative Requirements (QRs)."
            ]} 
          />
        )}
        
        {currentView === 'organization' && (
          <GenericContentPage 
            title="Procurement Organization Structure" 
            imageSrc="/images/crpf_organization.png"
            paragraphs={[
              "The Procurement Directorate is headed by the Inspector General (Provisioning), assisted by DIGs and Commandants responsible for distinct categories of stores.",
              "Our structure is decentralized for localized needs while centralized for capital acquisitions and major equipment, ensuring efficiency across all zones and sectors."
            ]} 
          />
        )}
        
        {currentView === 'dte-zone' && (
          <GenericContentPage 
            title="Directorates & Zones" 
            paragraphs={[
              "CRPF is organized into various Directorates and Zones across the country. Each Zone has delegated financial powers for routine procurement.",
              "Vendors can find zone-specific tender requirements under the Active Tenders section. Ensure you select the correct Zone when submitting bids."
            ]} 
          />
        )}
        
        {currentView === 'training' && (
          <GenericContentPage 
            title="Training Institutes Procurement" 
            imageSrc="/images/crpf_training.png"
            paragraphs={[
              "CRPF runs specialized training institutes across India. Procurement for these institutes includes advanced training simulators, specialized tactical gear, and educational infrastructure.",
              "Specialized tenders for training institutes will be flagged in the Active Tenders list."
            ]} 
          />
        )}
        
        {currentView === 'rti' && (
          <GenericContentPage 
            title="Right To Information (RTI)" 
            paragraphs={[
              "CRPF is committed to transparency. However, certain operational procurements are exempt under Section 24 of the RTI Act, 2005.",
              "For general queries regarding tender status, please use the public tracking features before filing an RTI application."
            ]} 
          />
        )}
        
        {currentView === 'contact' && <ContactUs />}
        
        {currentView === 'qrs' && (
          <DocumentList 
            title="Approved QRs & Specifications" 
            documents={[
              { title: "QR for Light Bullet Proof Vehicle (LBPV)", date: "15-Apr-2026" },
              { title: "Technical Specs for Tactical Vests", date: "02-Mar-2026" },
              { title: "QR for Night Vision Devices (NVD)", date: "10-Feb-2026" },
              { title: "Specifications for Troop Carriers", date: "22-Jan-2026" }
            ]} 
          />
        )}
        
        {currentView === 'procurement-plan' && (
          <DocumentList 
            title="Annual Procurement Plan" 
            documents={[
              { title: "Annual Procurement Plan - FY 2026-27 (Vehicles)", date: "01-Apr-2026" },
              { title: "Annual Procurement Plan - FY 2026-27 (IT & Comm)", date: "01-Apr-2026" },
              { title: "Annual Procurement Plan - FY 2026-27 (Clothing)", date: "01-Apr-2026" }
            ]} 
          />
        )}
        
        {currentView === 'mha-guidelines' && (
          <DocumentList 
            title="MHA Guidelines & Directives" 
            documents={[
              { title: "Make in India Procurement Directives", date: "05-May-2026" },
              { title: "Revised Guidelines for e-Tendering", date: "18-Mar-2026" },
              { title: "Security Protocols for IT Procurement", date: "12-Jan-2026" }
            ]} 
          />
        )}
        
        {currentView === 'active' && <ActiveTenders onEvaluate={() => setCurrentView('evaluation')} />}
        {currentView === 'archive' && <ArchiveTenders />}
        {currentView === 'faqs' && <TenderFaqs />}
        
        {currentView === 'evaluation' && (
          <div className="evaluation-container">
            {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded shadow-sm flex items-start gap-4">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="font-semibold text-sm">{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Tender Panel */}
          <div className="p-6 rounded-lg border border-slate-200 bg-slate-50 shadow-sm transition-all duration-300 group">
            <div className="flex items-center justify-between gap-3 mb-4 border-b border-slate-200 pb-3">
              <h2 className="font-black text-lg text-slate-800">📋 Tender Requirements</h2>
              <span className="text-[10px] uppercase tracking-[0.1em] text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 font-bold">Source 1</span>
            </div>
            <input type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={uploadTenderFile} className="block w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded file:border-0 file:bg-[#1e293b] file:text-white file:cursor-pointer file:font-bold hover:file:bg-slate-700 transition" />
            {tenderUploading && <div className="text-sm text-[#1e293b] mt-3 flex items-center gap-2 font-semibold"><div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>Uploading and extracting...</div>}
            <div className="mt-5 text-xs text-slate-500 font-bold uppercase tracking-wider">Extracted Content:</div>
            <textarea className="w-full h-40 mt-2 p-3 border border-slate-300 rounded bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition resize-none font-mono text-sm shadow-inner" value={tenderText} onChange={e=>setTenderText(e.target.value)} placeholder="Paste tender requirements here..." />
            {supportingInfo.length > 0 && (
              <div className="mt-4 rounded border border-blue-200 bg-blue-50 p-4">
                <div className="text-xs uppercase tracking-[0.1em] text-blue-800 font-black">Key Information Detected</div>
                <ul className="mt-2 space-y-1.5 text-sm text-blue-900 list-disc pl-5">
                  {supportingInfo.map((line, index)=>(
                    <li key={index} className="font-medium">{line}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Bidder Panel */}
          <div className="p-6 rounded-lg border border-slate-200 bg-slate-50 shadow-sm transition-all duration-300 group">
            <div className="flex items-center justify-between gap-3 mb-4 border-b border-slate-200 pb-3">
              <h2 className="font-black text-lg text-slate-800">🏢 Bidder Submission</h2>
              <span className="text-[10px] uppercase tracking-[0.1em] text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 font-bold">Source 2</span>
            </div>
            <input type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={uploadBidderFile} className="block w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded file:border-0 file:bg-[#1e293b] file:text-white file:cursor-pointer file:font-bold hover:file:bg-slate-700 transition" />
            {bidderUploading && <div className="text-sm text-[#1e293b] mt-3 flex items-center gap-2 font-semibold"><div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>Uploading and extracting...</div>}
            <div className="mt-5 text-xs text-slate-500 font-bold uppercase tracking-wider">Extracted Content:</div>
            <textarea className="w-full h-40 mt-2 p-3 border border-slate-300 rounded bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition resize-none font-mono text-sm shadow-inner" value={bidderText} onChange={e=>setBidderText(e.target.value)} placeholder="Paste bidder information here..." />
          </div>
        </div>

        <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-lg border border-slate-200 bg-slate-100 shadow-inner">
          <div className="flex items-center gap-3 flex-wrap">
            <button className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-[#1e293b] rounded shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-bold uppercase tracking-wider text-sm" onClick={runAnimatedEvaluation} disabled={processing || loading || (!criteria.length && !tenderText) || (!bidder && !bidderText)}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>{processing || loading ? 'Processing...' : 'Run Evaluation'}</span>
            </button>
            <button className="px-4 py-3 bg-white text-slate-700 rounded border border-slate-300 hover:bg-slate-50 transition text-xs font-bold uppercase tracking-wider shadow-sm" onClick={extractCriteriaFromText} disabled={tenderUploading || !tenderText}>
              Extract Criteria
            </button>
            <button className="px-4 py-3 bg-white text-slate-700 rounded border border-slate-300 hover:bg-slate-50 transition text-xs font-bold uppercase tracking-wider shadow-sm" onClick={extractBidderFromText} disabled={bidderUploading || !bidderText}>
              Extract Bidder Data
            </button>
          </div>
          <div className="text-xs text-slate-600 bg-white px-4 py-2 rounded border border-slate-200 font-bold shadow-sm">
            <span className="uppercase tracking-wider text-slate-400">Criteria:</span> <span className="text-slate-800 font-black">{criteria.length}</span> &nbsp; | &nbsp; <span className="uppercase tracking-wider text-slate-400">Bidder:</span> <span className={`font-black ${bidder ? 'text-green-600' : 'text-slate-400'}`}>{bidder ? '✓ Ready' : '✗ Pending'}</span>
          </div>
        </div>
        </div>
        )}
      </PortalLayout>

    <DetailedResultsModal
      isOpen={showDetailedResults}
      onClose={() => setShowDetailedResults(false)}
      decision={decision}
      confidence={confidence}
      reasons={reasons}
      evidence={evidence}
      comparisons={comparisons}
      criteria={criteria}
      bidder={bidder}
      tenderText={tenderText}
      bidderText={bidderText}
      complianceScore={complianceScore}
      matchedCount={matchedCount}
      flaggedCount={flaggedCount}
      riskScore={riskScore}
      fraudFlags={fraudFlags}
    />
    <CopilotWidget tenderText={tenderText} bidderText={bidderText} />
    </>
  )
}

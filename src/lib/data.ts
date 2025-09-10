import type { Contract, RiskAnalysis } from './types';

export const contract: Contract & { riskAnalyses: (RiskAnalysis & { clauseId: string })[] } = {
  title: 'Mutual Non-Disclosure Agreement',
  clauses: [
    {
      id: 'clause-1',
      title: 'Definition of Confidential Information',
      text: "For the purposes of this Agreement, 'Confidential Information' shall include all information or material that has or could have commercial value or other utility in the business in which Disclosing Party is engaged. This includes, but is not limited to, trade secrets, financial information, customer lists, and business strategies. If Confidential Information is in written form, the Disclosing Party shall label or stamp the materials with the word 'Confidential' or some similar warning. If Confidential Information is transmitted orally, the Disclosing Party shall promptly provide a writing indicating that such oral communication constituted Confidential Information.",
      entities: [
        { name: 'Disclosing Party', type: 'Party' },
        { name: 'Confidential Information', type: 'Legal Term' },
      ],
    },
    {
      id: 'clause-2',
      title: 'Exclusions from Confidential Information',
      text: "Receiving Party's obligations under this Agreement do not extend to information that is: (a) publicly known at the time of disclosure or subsequently becomes publicly known through no fault of the Receiving Party; (b) discovered or created by the Receiving Party before disclosure by Disclosing Party; (c) learned by the Receiving Party through legitimate means other than from the Disclosing Party or Disclosing Party's representatives; or (d) is disclosed by Receiving Party with Disclosing Party's prior written approval.",
      entities: [
        { name: 'Receiving Party', type: 'Party' },
        { name: 'Disclosing Party', type: 'Party' },
      ],
    },
    {
      id: 'clause-3',
      title: 'Obligations of Receiving Party',
      text: 'The Receiving Party shall hold and maintain the Confidential Information in strictest confidence for the sole and exclusive benefit of the Disclosing Party. The Receiving Party shall carefully restrict access to Confidential Information to employees, contractors, and third parties as is reasonably required and shall require those persons to sign nondisclosure restrictions at least as protective as those in this Agreement.',
      entities: [
        { name: 'Receiving Party', type: 'Party' },
        { name: 'Disclosing Party', type: 'Party' },
        { name: 'hold and maintain Confidential Information', type: 'Obligation' },
      ],
    },
    {
      id: 'clause-4',
      title: 'Term',
      text: 'The nondisclosure provisions of this Agreement shall survive the termination of this Agreement and the Receiving Party\'s duty to hold Confidential Information in confidence shall remain in effect until the Confidential Information no longer qualifies as a trade secret or until Disclosing Party sends Receiving Party written notice releasing Receiving Party from this Agreement, whichever occurs first. The agreement is effective as of January 1, 2025.',
      entities: [
        { name: 'January 1, 2025', type: 'Date' },
        { name: 'termination', type: 'Event' },
      ],
    },
    {
      id: 'clause-5',
      title: 'Governing Law',
      text: 'This Agreement shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of laws principles. Any legal action or proceeding arising under this Agreement will be brought exclusively in the federal or state courts located in San Francisco, California.',
      entities: [
        { name: 'State of California', type: 'Jurisdiction' },
        { name: 'San Francisco, California', type: 'Jurisdiction' },
      ],
    },
    {
      id: 'clause-6',
      title: 'Indemnification',
      text: 'The Receiving Party agrees to indemnify, defend, and hold harmless the Disclosing Party from any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys\' fees) arising from any breach of this Agreement by the Receiving Party or its representatives. This indemnification is uncapped and applies to all forms of damages, including direct, indirect, consequential, and punitive damages.',
      entities: [
        { name: 'Receiving Party', type: 'Party' },
        { name: 'Disclosing Party', type: 'Party' },
        { name: 'indemnify, defend, and hold harmless', type: 'Obligation' },
        { name: 'uncapped', type: 'Amount' },
      ],
    },
  ],
  riskAnalyses: [
    {
      clauseId: 'clause-1',
      riskScore: 20,
      riskLevel: 'low',
      colorCode: 'green',
    },
    {
      clauseId: 'clause-2',
      riskScore: 10,
      riskLevel: 'low',
      colorCode: 'green',
    },
    {
      clauseId: 'clause-3',
      riskScore: 45,
      riskLevel: 'medium',
      colorCode: 'amber',
    },
    {
      clauseId: 'clause-4',
      riskScore: 60,
      riskLevel: 'medium',
      colorCode: 'amber',
    },
    {
      clauseId: 'clause-5',
      riskScore: 30,
      riskLevel: 'low',
      colorCode: 'green',
    },
    {
      clauseId: 'clause-6',
      riskScore: 90,
      riskLevel: 'high',
      colorCode: 'red',
    },
  ],
};
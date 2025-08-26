import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckIcon, ArrowLeftIcon } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <CheckIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Valid2Go</h1>
          <p className="text-gray-600 text-sm mt-1">Professional Email Verification</p>
        </div>

        {/* Back Link */}
        <div className="max-w-4xl mx-auto mb-6">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to sign in
          </Link>
        </div>

        <Card className="max-w-4xl mx-auto shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </CardHeader>
          
          <CardContent className="prose max-w-none space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">1. Introduction</h2>
              <p className="text-gray-700">
                At Valid2Go, we respect your privacy and are committed to protecting your personal data. This Privacy Policy 
                explains how we collect, use, and safeguard your information when you use our email verification service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">2. Information We Collect</h2>
              <p className="text-gray-700">
                We collect information in several ways when you use our service:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">2.1 Account Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Name and email address</li>
                    <li>Password (encrypted and stored securely)</li>
                    <li>Account preferences and settings</li>
                    <li>Billing information for paid plans</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">2.2 Usage Data</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Email addresses submitted for verification</li>
                    <li>Verification results and statistics</li>
                    <li>API usage logs and metrics</li>
                    <li>Device information and IP addresses</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">2.3 Technical Data</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Cookies and similar tracking technologies</li>
                    <li>Website usage analytics</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">3. How We Use Your Information</h2>
              <p className="text-gray-700">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Providing and improving our email verification services</li>
                <li>Processing your account registration and authentication</li>
                <li>Billing and payment processing for paid plans</li>
                <li>Sending service-related notifications and updates</li>
                <li>Analyzing usage patterns to improve our service</li>
                <li>Preventing fraud and ensuring service security</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">4. Data Retention</h2>
              <p className="text-gray-700">
                We retain your personal data only as long as necessary:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Account Data:</strong> Until you delete your account</li>
                <li><strong>Email Verification Data:</strong> 30 days after verification</li>
                <li><strong>Usage Logs:</strong> 12 months for analytics and security</li>
                <li><strong>Billing Data:</strong> As required by law (typically 7 years)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">5. Data Sharing and Disclosure</h2>
              <p className="text-gray-700">
                We do not sell, trade, or rent your personal information. We may share data only in these circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Service Providers:</strong> Third-party services that help us operate (payment processors, hosting)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                <li><strong>Consent:</strong> When you explicitly consent to sharing</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">6. Data Security</h2>
              <p className="text-gray-700">
                We implement comprehensive security measures to protect your data:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and penetration testing</li>
                <li>Access controls and employee training</li>
                <li>Secure data centers with physical security</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">7. Your Rights</h2>
              <p className="text-gray-700">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Access:</strong> Request copies of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
                <li><strong>Objection:</strong> Object to processing of your personal data</li>
                <li><strong>Restriction:</strong> Request limitation of processing</li>
              </ul>
              <p className="text-gray-700 mt-4">
                To exercise these rights, please contact us at privacy@valid2go.com.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">8. Cookies and Tracking</h2>
              <p className="text-gray-700">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Keep you signed in to your account</li>
                <li>Remember your preferences and settings</li>
                <li>Analyze website usage and performance</li>
                <li>Provide personalized content and features</li>
              </ul>
              <p className="text-gray-700 mt-4">
                You can control cookies through your browser settings, but this may affect site functionality.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">9. Third-Party Services</h2>
              <p className="text-gray-700">
                Our service integrates with third-party providers:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Payment Processors:</strong> For billing and subscription management</li>
                <li><strong>Analytics:</strong> For website usage analysis</li>
                <li><strong>Email Services:</strong> For system notifications</li>
                <li><strong>Cloud Hosting:</strong> For service infrastructure</li>
              </ul>
              <p className="text-gray-700 mt-4">
                These services have their own privacy policies, and we encourage you to review them.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">10. International Data Transfers</h2>
              <p className="text-gray-700">
                Your data may be processed in countries other than your own. We ensure appropriate safeguards are in place 
                for any international transfers, including standard contractual clauses and adequacy decisions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">11. Children&apos;s Privacy</h2>
              <p className="text-gray-700">
                Our service is not intended for children under 13. We do not knowingly collect personal information from 
                children under 13. If we discover that we have collected such information, we will delete it immediately.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">12. Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Sending an email to your registered address</li>
                <li>Posting a notice on our website</li>
                <li>Updating the &quot;Last updated&quot; date at the top of this policy</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">13. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@valid2go.com<br />
                  <strong>Support:</strong> support@valid2go.com<br />
                  <strong>Address:</strong> [Your Business Address]<br />
                  <strong>Data Protection Officer:</strong> dpo@valid2go.com
                </p>
              </div>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-500 text-center">
                This Privacy Policy is effective as of the date last updated above. We encourage you to review this 
                policy periodically to stay informed about how we protect your information.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link
            href="/terms"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            View Terms of Service
          </Link>
        </div>
      </div>
    </div>
  )
}
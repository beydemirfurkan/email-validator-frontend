import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckIcon, ArrowLeftIcon } from 'lucide-react'

export default function TermsOfServicePage() {
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
            <CardTitle className="text-3xl font-bold text-center">Terms of Service</CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </CardHeader>
          
          <CardContent className="prose max-w-none space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using Valid2Go (&quot;Service&quot;), you accept and agree to be bound by the terms and 
                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">2. Description of Service</h2>
              <p className="text-gray-700">
                Valid2Go provides email validation and verification services to help businesses maintain clean email lists 
                and improve deliverability rates. Our service includes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Single email validation</li>
                <li>Bulk email list verification</li>
                <li>API access for automated verification</li>
                <li>Real-time validation results</li>
                <li>Detailed verification reports</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">3. User Accounts</h2>
              <p className="text-gray-700">
                To access certain features of the Service, you must register for an account. You are responsible for 
                maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">4. Acceptable Use</h2>
              <p className="text-gray-700">
                You agree to use Valid2Go only for lawful purposes. You may not use our service to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Validate email addresses for spamming purposes</li>
                <li>Engage in any fraudulent or illegal activities</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Upload malicious content or malware</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">5. Pricing and Payment</h2>
              <p className="text-gray-700">
                Valid2Go offers both free and paid plans. Paid plans are billed monthly or annually as selected during 
                subscription. All payments are processed securely through third-party payment processors.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">6. Data Privacy and Security</h2>
              <p className="text-gray-700">
                We take your privacy seriously. Please refer to our Privacy Policy for detailed information about how we 
                collect, use, and protect your data. We implement industry-standard security measures to protect your 
                information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">7. API Usage</h2>
              <p className="text-gray-700">
                API access is subject to rate limits based on your subscription plan. Abuse of the API may result in 
                temporary or permanent suspension of access. API keys must be kept confidential and secure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">8. Service Availability</h2>
              <p className="text-gray-700">
                While we strive to maintain 99.9% uptime, we do not guarantee uninterrupted service. We may perform 
                scheduled maintenance that could temporarily affect service availability.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">9. Limitation of Liability</h2>
              <p className="text-gray-700">
                Valid2Go shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                including without limitation, loss of profits, data, use, or other intangible losses resulting from your 
                use of the service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">10. Termination</h2>
              <p className="text-gray-700">
                We may terminate or suspend your account and access to the service immediately, without prior notice, 
                if you breach these Terms of Service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">11. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these terms at any time. We will notify users of any material changes 
                via email or through our service. Continued use of the service after changes constitutes acceptance of 
                the new terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">12. Contact Information</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> support@valid2go.com<br />
                  <strong>Address:</strong> [Your Business Address]
                </p>
              </div>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-500 text-center">
                These terms are effective as of the date last updated above and will remain in effect except with 
                respect to any changes in their provisions in the future, which will be in effect immediately after 
                being posted on this page.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link
            href="/privacy"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            View Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}
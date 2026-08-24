function CorporateTravel() {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-16 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Corporate & Executive Travel
              </h2>
              <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                Professional transport for business meetings, corporate events, and executive travel. Our premium vehicles and experienced drivers ensure you arrive on time and in comfort.
              </p>
            </div>

            {/* Features List */}
            <ul className="space-y-4">
              {[
                'Fixed pricing for corporate accounts',
                'Professional and discreet drivers',
                'Premium vehicle fleet',
                'Account management and billing',
                'Multiple destination bookings',
                'Business meeting coordination',
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400">
                    <svg className="h-4 w-4 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </div>
                  <span className="text-base text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="pt-2">
              <a
                href="mailto:bookings@abbeycars.com"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-base font-semibold text-white transition hover:bg-slate-800"
              >
                Enquire About Corporate Rates
              </a>
            </div>
          </div>

          {/* Right Side - Visual Element */}
          <div className="relative">
            <div className="rounded-2xl bg-white p-8 shadow-lg border border-slate-200">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-400/20">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Fixed Pricing</p>
                    <p className="font-semibold text-slate-900">No hidden charges</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-400/20">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Reliability</p>
                    <p className="font-semibold text-slate-900">24/7 availability</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-400/20">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Speed</p>
                    <p className="font-semibold text-slate-900">Quick booking & confirmation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CorporateTravel

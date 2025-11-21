import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
}

export function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
  const isPrivacy = type === 'privacy';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]" data-testid={`modal-${type}`}>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            {isPrivacy ? (
              <>
                <section>
                  <h3 className="text-lg font-semibold mb-3">1. Information We Collect</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We collect information you provide directly to us, including your name, email
                    address, and payment information when you create an account or make a purchase.
                    We also collect information about your usage of our services.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">2. How We Use Your Information</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We use the information we collect to provide, maintain, and improve our
                    services, process transactions, send you technical notices and support messages,
                    and communicate with you about products, services, and events.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">3. Information Sharing</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We do not share your personal information with third parties except as described
                    in this policy. We may share information with service providers who perform
                    services on our behalf, or when required by law.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">4. Data Security</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We implement appropriate technical and organizational measures to protect your
                    personal information against unauthorized access, alteration, disclosure, or
                    destruction.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">5. Your Rights</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You have the right to access, update, or delete your personal information at any
                    time. You can also opt out of receiving promotional communications from us.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">6. Contact Us</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us at
                    devbydaksh@gmail.com.
                  </p>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing and using ShopFlow, you accept and agree to be bound by these Terms
                    of Service. If you do not agree to these terms, please do not use our services.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">2. Use of Services</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You agree to use our services only for lawful purposes and in accordance with
                    these Terms. You are responsible for maintaining the confidentiality of your
                    account credentials and for all activities that occur under your account.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">3. Subscription and Payment</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Some features of our services require a paid subscription. You agree to pay all
                    fees associated with your subscription. All prices are inclusive of applicable
                    taxes unless otherwise stated. Subscriptions automatically renew unless cancelled.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">4. Intellectual Property</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The services and all content, features, and functionality are owned by Ayudak and
                    are protected by copyright, trademark, and other intellectual property laws.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">5. Termination</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We may terminate or suspend your account and access to our services immediately,
                    without prior notice, for any reason, including if you breach these Terms.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">6. Limitation of Liability</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To the maximum extent permitted by law, Ayudak shall not be liable for any
                    indirect, incidental, special, consequential, or punitive damages resulting from
                    your use of our services.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">7. Changes to Terms</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We reserve the right to modify these Terms at any time. We will notify you of any
                    changes by posting the new Terms on this page and updating the "Last Updated"
                    date.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">8. Contact Information</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about these Terms, please contact us at
                    devbydaksh@gmail.com.
                  </p>
                </section>
              </>
            )}

            <div className="pt-6 border-t">
              <p className="text-xs text-muted-foreground">
                Last Updated: November 21, 2025
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

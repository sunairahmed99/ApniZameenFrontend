import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer/Footer';
import './TermsOfUse.css';

const TermsOfUse = () => {
    const [activeSection, setActiveSection] = useState('definitions');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const scrollToSection = (sectionId) => {
        setActiveSection(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    };

    const sections = [
        { id: 'definitions', title: '1. Definitions', icon: '📋' },
        { id: 'general-terms', title: '2. General Terms', icon: '📄' },
        { id: 'paid-postings', title: '3. Paid Postings', icon: '💳' },
        { id: 'posting-agents', title: '4. Posting Agents', icon: '👥' },
        { id: 'no-spam', title: '5. No Spam Policy', icon: '🚫' },
        { id: 'liability', title: '6. Limitation of Liability', icon: '⚖️' },
        { id: 'indemnity', title: '7. Indemnity', icon: '🛡️' },
        { id: 'property', title: '8. Property', icon: '🏠' },
        { id: 'call-recording', title: '9. Call Recording/Brokers', icon: '📞' },
        { id: 'ad-services', title: '10. Ad Services Package', icon: '📦' },
        { id: 'general', title: '11. General', icon: '📌' }
    ];

    return (
        <div className="terms-page">
            <Navbar />

            {/* Hero Section */}
            <div className="terms-hero">
                <div className="container">
                    <h1>Terms of Use</h1>
                    <p>Find the step-by-step usage criteria below and any additional conditions which may apply.</p>
                </div>
            </div>

            <div className="container">
                <div className="terms-breadcrumb">
                    <span>Home</span> / <span className="active">Terms & Privacy Policy</span>
                </div>

                <div className="terms-content-wrapper">
                    {/* Sidebar Navigation */}
                    <aside className="terms-sidebar">
                        <nav className="terms-nav">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    className={`terms-nav-item ${activeSection === section.id ? 'active' : ''}`}
                                    onClick={() => scrollToSection(section.id)}
                                >
                                    <span className="nav-icon">{section.icon}</span>
                                    <span className="nav-title">{section.title}</span>
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="terms-main-content">
                        {/* Introduction */}
                        <div className="terms-intro">
                            <p className="intro-date"><strong>Last Updated:</strong> February 2025 (Effective Date)</p>
                            <p>
                                By using <a href="/">www.zameen.com</a> or the Zameen mobile application of the online platform collectively, the <strong>"Website"</strong>, you confirm that you have read, understood and accept these terms of use along with the <a href="/privacy-policy">Privacy Policy</a>.
                                So, we do not only govern your access to and use of the Website and the Services, you agree to comply with them. If you do not accept or agree to comply with these Terms, we request that you must not use the Website. Additionally, when using a portion of the Services, you agree to conform to any applicable posted guidelines for such Services, which may change or be updated from to time at our sole discretion.
                            </p>
                            <p>
                                These Terms are made between Zameen Media (Private) Limited <strong>("we")</strong> or <strong>"us"</strong> or <strong>"our Company"</strong>, as applicable and you <strong>"you"</strong> or <strong>"the User"</strong>. The Company is part of the Zameen Holdings Limited, which operates various websites of the Website.
                            </p>
                            <p>
                                If you are a company advertising on our Website, you will be required to enter into additional terms and conditions set out in our Advertising Agreement, however, please note that these Terms will still apply and must be read in conjunction with any other agreement you enter into with the Company.
                            </p>
                        </div>

                        {/* Section 1: Definitions */}
                        <section id="definitions" className="terms-section">
                            <h2>1. DEFINITIONS</h2>
                            <p>The following capitalized terms shall have the following meaning, except where the context otherwise requires:</p>
                            <div className="definition-list">
                                <div className="definition-item">
                                    <strong>1.1 "Advertising Agreement"</strong> - an agreement for the provision of advertising services or products entered into between the Company and the Client.
                                </div>
                                <div className="definition-item">
                                    <strong>1.2 "Ad Services Package"</strong> - the bundle of advertising product or service vehicles the Company agrees to provide to the Customer as set out in the relevant order form provided by the Company and signed by the Client to order the Ad Services Package pursuant to these Terms and the Ad Services Package Advertising Agreement.
                                </div>
                                <div className="definition-item">
                                    <strong>1.3 "Affiliates"</strong> - any company that is controlled or is owned by Zameen, any company commonly controlled or owned by Zameen and any Zameen Holdings Limited entity jointly offering the Services.
                                </div>
                                <div className="definition-item">
                                    <strong>1.4 "Zameen"</strong> - Zameen Media (Private) Limited which is the owner of <a href="/">www.zameen.com</a> and whose registered office is Plot Gate, 54-W & MM Alam Road, Gulberg III, Lahore.
                                </div>
                                <div className="definition-item">
                                    <strong>1.5 "Client"</strong> - the client entity that is party to the Advertising Agreement.
                                </div>
                                <div className="definition-item">
                                    <strong>1.6 "Customer"</strong> - any customer of the Client.
                                </div>
                                <div className="definition-item">
                                    <strong>1.7 "Effective Date"</strong> - the date set out at the top of these Terms.
                                </div>
                                <div className="definition-item">
                                    <strong>1.8 "Intellectual Property Rights"</strong> - all intellectual property, including patents, trade marks, rights in goodwill, database rights and rights in data, rights in designs, copyrights and topography rights (whether or not any of them are registered, and including applications and the right to apply for registration of any such right).
                                </div>
                                <div className="definition-item">
                                    <strong>1.9 "Material"</strong> - material and content published on the Website or otherwise provided by the Company in connection with the Services.
                                </div>
                                <div className="definition-item">
                                    <strong>1.10 "Privacy Policy"</strong> - the privacy policy of the Company from time to time.
                                </div>
                                <div className="definition-item">
                                    <strong>1.11 "Product"</strong> - an online classified advertising platform provided on the Website and the Ad Services Package.
                                </div>
                                <div className="definition-item">
                                    <strong>1.12 "Posting Agents"</strong> - a third-party agent, service, or intermediary that offers to post Material to the Service on behalf of others.
                                </div>
                                <div className="definition-item">
                                    <strong>1.13 "Registration Details"</strong> - the details a User must provide upon registering for the Website from time to time (for example: name, phone numbers, email address, and/or other address).
                                </div>
                                <div className="definition-item">
                                    <strong>1.14 "Service"</strong> - the provision of the Website and the Product.
                                </div>
                                <div className="definition-item">
                                    <strong>1.15 "Unacceptable"</strong> - any material or information uploaded to or made available on the Website which under the law of any jurisdiction from which the Website may be accessed is prohibited:
                                    <ul>
                                        <li>Obscene, blasphemous, defamatory or in any way unlawful;</li>
                                        <li>Harmful or potentially harmful to minors, threatening, libelous, abused to be or actually defamatory or in infringement of third party rights (or sections) nature (all of which are expressly prohibited);</li>
                                        <li>Breach of any applicable law, regulation, standard or codes of practice (whether or not having the force of law);</li>
                                        <li>In contravention of legislation including without limitation, the causing to weapons, entries or distract or disrupt broadcasting or illegal gambling;</li>
                                    </ul>
                                </div>
                                <div className="definition-item">
                                    <strong>1.16 "User Material"</strong> - material and content posted on the Website by a User or otherwise provided to Zameen Holdings Limited by a User in connection with the Website or the Service.
                                </div>
                                <div className="definition-item">
                                    <strong>1.17 "Zameen Holding Limited"</strong> - the Zameen Holdings Limited, including- without limitation, Zameen and any of its Affiliates.
                                </div>
                            </div>
                        </section>

                        {/* Section 2: General Terms */}
                        <section id="general-terms" className="terms-section">
                            <h2>2. GENERAL TERMS</h2>
                            <p>The following general terms and conditions apply to all users of the Website:</p>
                            <ul className="terms-list">
                                <li>You must be at least 18 years old to use this Website and the Services.</li>
                                <li>You are responsible for maintaining the confidentiality of your account and password.</li>
                                <li>You agree to accept responsibility for all activities that occur under your account.</li>
                                <li>You agree to provide accurate, current, and complete information during registration.</li>
                                <li>You agree not to use the Website for any illegal or unauthorized purpose.</li>
                                <li>You must not transmit any worms or viruses or any code of a destructive nature.</li>
                                <li>We reserve the right to refuse service, terminate accounts, remove or edit content at our sole discretion.</li>
                            </ul>
                        </section>

                        {/* Section 3: Paid Postings */}
                        <section id="paid-postings" className="terms-section">
                            <h2>3. PAID POSTINGS</h2>
                            <p>The Website offers paid posting options for enhanced visibility and features:</p>
                            <ul className="terms-list">
                                <li>Paid postings are subject to additional terms and pricing as specified on the Website.</li>
                                <li>Payment must be made in full before the posting goes live.</li>
                                <li>Refunds are subject to our refund policy and may not be available in all circumstances.</li>
                                <li>Paid postings are subject to review and approval by our team before being published.</li>
                                <li>We reserve the right to reject any paid posting that violates our terms or policies.</li>
                                <li>Duration and features of paid postings are as specified in the purchased package.</li>
                            </ul>
                        </section>

                        {/* Section 4: Posting Agents */}
                        <section id="posting-agents" className="terms-section">
                            <h2>4. POSTING AGENTS</h2>
                            <p>Regarding third-party posting agents and services:</p>
                            <ul className="terms-list">
                                <li>Posting Agents must comply with all applicable terms and conditions.</li>
                                <li>The use of automated posting tools requires prior authorization from Zameen.</li>
                                <li>Unauthorized use of posting agents may result in account suspension or termination.</li>
                                <li>All postings made through agents are subject to the same terms as direct postings.</li>
                                <li>You remain responsible for all content posted on your behalf by agents.</li>
                            </ul>
                        </section>

                        {/* Section 5: No Spam Policy */}
                        <section id="no-spam" className="terms-section">
                            <h2>5. NO SPAM POLICY</h2>
                            <p>Zameen maintains a strict anti-spam policy:</p>
                            <ul className="terms-list">
                                <li>Users may not post duplicate, repetitive, or misleading content.</li>
                                <li>Over-posting or flooding the platform with similar listings is prohibited.</li>
                                <li>Each listing must represent a unique and genuine property or service.</li>
                                <li>Misleading titles, descriptions, or contact information are not permitted.</li>
                                <li>Violation of this policy may result in immediate removal of content and account suspension.</li>
                                <li>We employ automated systems to detect and prevent spam activities.</li>
                            </ul>
                        </section>

                        {/* Section 6: Limitation of Liability */}
                        <section id="liability" className="terms-section">
                            <h2>6. LIMITATION OF LIABILITY</h2>
                            <p>Important limitations regarding our liability:</p>
                            <ul className="terms-list">
                                <li>The Website and Services are provided on an "as is" and "as available" basis.</li>
                                <li>We do not warrant that the Service will be uninterrupted, timely, secure, or error-free.</li>
                                <li>We are not responsible for any content posted by users on the platform.</li>
                                <li>We do not guarantee the accuracy, completeness, or usefulness of information on the Website.</li>
                                <li>Our liability is limited to the maximum extent permitted by applicable law.</li>
                                <li>We are not liable for any indirect, incidental, or consequential damages.</li>
                            </ul>
                        </section>

                        {/* Section 7: Indemnity */}
                        <section id="indemnity" className="terms-section">
                            <h2>7. INDEMNITY</h2>
                            <p>You agree to indemnify and hold harmless Zameen and its affiliates:</p>
                            <ul className="terms-list">
                                <li>You will indemnify Zameen against all claims arising from your use of the Website.</li>
                                <li>This includes claims related to content you post or actions you take on the platform.</li>
                                <li>You agree to defend Zameen against third-party claims related to your activities.</li>
                                <li>You will reimburse Zameen for any losses, damages, or legal fees incurred.</li>
                                <li>This indemnification survives termination of your account or use of the Service.</li>
                            </ul>
                        </section>

                        {/* Section 8: Property */}
                        <section id="property" className="terms-section">
                            <h2>8. PROPERTY</h2>
                            <p>Regarding property listings and transactions:</p>
                            <ul className="terms-list">
                                <li>All property information must be accurate and up-to-date.</li>
                                <li>You must have proper authorization to list any property on the Website.</li>
                                <li>Property images and descriptions must accurately represent the property.</li>
                                <li>Pricing information must be current and reflect actual market conditions.</li>
                                <li>Zameen is not a party to any transaction between users.</li>
                                <li>We recommend conducting proper due diligence before any property transaction.</li>
                            </ul>
                        </section>

                        {/* Section 9: Call Recording/Brokers */}
                        <section id="call-recording" className="terms-section">
                            <h2>9. CALL RECORDING/BROKERS</h2>
                            <p>Information about call recording and broker services:</p>
                            <ul className="terms-list">
                                <li>Calls made through the platform may be recorded for quality and training purposes.</li>
                                <li>By using our calling features, you consent to call recording.</li>
                                <li>Recorded calls may be used to resolve disputes or verify information.</li>
                                <li>Brokers and agents must maintain professional standards in all communications.</li>
                                <li>Harassment or inappropriate conduct during calls is strictly prohibited.</li>
                            </ul>
                        </section>

                        {/* Section 10: Ad Services Package */}
                        <section id="ad-services" className="terms-section">
                            <h2>10. AD SERVICES PACKAGE</h2>
                            <p>Terms specific to advertising service packages:</p>
                            <ul className="terms-list">
                                <li>Ad Services Packages are subject to separate advertising agreements.</li>
                                <li>Package features and duration are as specified in your purchase agreement.</li>
                                <li>Payment terms are outlined in the specific package agreement.</li>
                                <li>Changes to packages may be made at Zameen's discretion with notice.</li>
                                <li>Performance metrics are provided on a best-effort basis.</li>
                                <li>Refunds and cancellations are governed by the advertising agreement terms.</li>
                            </ul>
                        </section>

                        {/* Section 11: General */}
                        <section id="general" className="terms-section">
                            <h2>11. GENERAL</h2>
                            <p>Additional general provisions:</p>
                            <ul className="terms-list">
                                <li>These Terms constitute the entire agreement between you and Zameen.</li>
                                <li>We reserve the right to modify these Terms at any time.</li>
                                <li>Continued use of the Website after changes constitutes acceptance of modified terms.</li>
                                <li>If any provision is found invalid, the remaining provisions remain in effect.</li>
                                <li>These Terms are governed by the laws of Pakistan.</li>
                                <li>Disputes shall be subject to the exclusive jurisdiction of Pakistani courts.</li>
                            </ul>
                        </section>

                        {/* Contact CTA */}
                        <div className="terms-cta">
                            <h3>Have Questions About Our Terms?</h3>
                            <p>If you have any questions or concerns about these Terms of Use, please don't hesitate to contact us.</p>
                            <a href="/contact" className="btn-contact">Contact Now to Advertise</a>
                        </div>
                    </main>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TermsOfUse;

import { InfoPage, SupportContact } from '../../components/InfoPage';

export default function ContactPage() {
  return <InfoPage title="Contact Blyth">
    <p>For early-access questions, feedback or removal from the waitlist, contact <SupportContact />.</p>
    <p>Please do not send bank credentials, API keys, card numbers or detailed financial records. For a waitlist removal request, use the address you signed up with.</p>
  </InfoPage>;
}

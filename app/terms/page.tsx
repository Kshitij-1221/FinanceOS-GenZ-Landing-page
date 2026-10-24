import { InfoPage, SupportContact } from '../../components/InfoPage';

export default function EarlyAccessPage() {
  return <InfoPage title="About early access">
    <p>Joining the Blyth waitlist is free. It requests a welcome confirmation and an early-access announcement by email; it does not create an app account, reserve a paid plan, or guarantee a launch date or place in a beta.</p>
    <p>Blyth is being developed as a personal finance tracker. Its jar is a projection based on recorded information. It does not hold or transfer funds, connect to a bank, execute investments, or provide investment advice.</p>
    <p>Features, availability and AI usage limits may change during testing. Any paid offering will be explained before you decide whether to purchase it.</p>
    <p>Please enter an email address you control. For waitlist questions or removal requests, contact <SupportContact />.</p>
  </InfoPage>;
}

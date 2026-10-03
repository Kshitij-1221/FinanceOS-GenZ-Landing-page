import { InfoPage, SupportContact } from '../../components/InfoPage';

export default function PrivacyPage() {
  return <InfoPage title="Blyth privacy notice">
    <p>Updated 3 October 2026. This notice covers the early-access waitlist and describes the current app prototype.</p>
    <p>When you join, we store your email, signup time, source and the version of the consent statement in Supabase. We use this to send the early-access announcement you requested. Joining does not create an app account or subscribe you to unrelated marketing.</p>
    <p>The site is hosted on Vercel. To limit automated submissions, the server derives a temporary, keyed hash from your IP address. This hash changes daily; the abuse counters expire after a day and are removed on later requests. The waitlist database does not store the raw IP address. Hosting providers may maintain their own operational logs.</p>
    <p>Only the server and authorised project administrators can access the waitlist. We do not sell the email list. You can ask to remove your email before the announcement, or request a copy of your signup details, by contacting <SupportContact />.</p>
    <p>We will retain the waitlist only while preparing and sending early access, and remove entries within 90 days after the announcement unless you separately choose an ongoing service. Removal requests are handled manually during this early stage.</p>
    <p>In the current app, finance records are stored on your device. If you choose AI, your messages and relevant financial context are sent through our assistant service to OpenAI. Voice input also sends the submitted recording for transcription. AI use is optional and entries require review before saving. The prototype does not provide cloud backup or bank connections.</p>
    <p>Our assistant server does not save recordings or log their transcripts. This is not a claim of zero retention by OpenAI. Provider processing follows its applicable API data policies. Details will be reviewed again before the app launches publicly.</p>
  </InfoPage>;
}

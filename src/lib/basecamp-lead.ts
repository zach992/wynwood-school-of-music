// Shared instructions appended to the lead details in Basecamp. Keeping this in
// source control prevents a Zap field refresh from silently deleting the
// front-desk workflow, which is what happened to the trial-lesson automation.
export const BASECAMP_LEAD_FOLLOW_UP_HTML = `
<br><br>
<h3>Lead Contact Steps</h3>
<p>Please cross off each step as it is completed. This helps ensure that if a lead transfers from one manager to another, the next person can pick up exactly where the previous person left off.</p>

<h4>Day 1: Initial Contact</h4>
<p>☐ <b>Step 1: Lead Comes In</b><br>
☐ <b>Step 2: Call</b><br>
☐ <b>Step 3: Voicemail</b> — leave if no answer<br>
☐ <b>Step 4: Send Follow-Up Text</b></p>
<p><i>Text Message Template:</i></p>
<blockquote>Hi NAME, this is Wynwood School of Music reaching out about scheduling music lessons.<br><br>
Feel free to call us back or respond here, and we'd be happy to help you get started!</blockquote>

<h4>Day 2: Second Contact Attempt</h4>
<p>☐ <b>Step 1: Call</b><br>
☐ <b>Step 2: Voicemail</b> — leave if no answer<br>
☐ <b>Step 3: Send Follow-Up Email</b></p>
<p><i>Email Template:</i></p>
<blockquote><b>Subject:</b> Music Lessons at Wynwood School of Music<br><br>
Hi NAME,<br><br>
This is Wynwood School of Music reaching out about scheduling music lessons.<br><br>
Feel free to call us back at 305-359-5515 or reply to this email, and we'd be happy to help you get started.<br><br>
Best,<br>
Wynwood School of Music</blockquote>

<h4>Day 3: Final Contact Attempt</h4>
<p>☐ <b>Step 1: Call</b><br>
☐ <b>Step 2: Voicemail</b> — leave if no answer<br>
☐ <b>Step 3: Send Final Follow-Up Text</b><br>
☐ <b>Step 4: Send Final Follow-Up Email</b></p>
<p><i>Final Follow-Up Template:</i></p>
<blockquote>Hi NAME,<br><br>
We're sorry we haven't been able to connect about scheduling music lessons.<br><br>
For now, we'll keep you on our mailing list for future updates and stop following up directly. Please don't hesitate to reach back out whenever you're ready to set up lessons at Wynwood School of Music!</blockquote>

<h4>Day 4: Retire Lead</h4>
<p>☐ Retire lead<br>
☐ Check off the to-do<br>
☐ Confirm all contact steps were completed or crossed out</p>`;

---
title: Hardening Google Account
---

Some steps I followed to harden google account. If you can just delete your account that is preferable, but I am currently migrating to a new base email provider and need to keep it for a while to ensure any accounts I need access to I still have access to. 

This requires you to have a password manager and Authenticator App setup (I use [KeepassXC](https://github.com/keepassxreboot/keepassxc) for both of those, split into 2 separate keepass db files with different passwords (which I remember)). See [PrivacyGuides](https://www.privacyguides.org/en/passwords/) for more recommendations.

I don't think all of these things are bad, but I do think you should not use google for all of these. Diversifying how you access/share this information with other people (contacts/live location) by using different websites/applications decreases the possibility that this information is all collated into one big dataset that is shared with data brokers.

Go to <https://myaccount.google>

A lot of the recommendations here mean you more often have to enter your password and things are not as 'automatic', but I think that is a good thing! I think its a good idea to increase your algorithmic friction - you should not be giving data to companies by default.

In general, I'm recommending things to make this the most secure without just deleting your account. For example, I think you should remove recovery emails and just use a 64+ character password, have 2-Auth using a Authenticator app/service, and not have any other way of getting back into your account. Having recovery emails/phone numbers increases your attack surface as it means if someone gets access to one of your accounts, they have more of an ability to infiltrate others. If you don't think this applies to you, you don't have to do it!

You should be backing up your password & TOTP data to an external drive or cloud service somewhere periodically (make sure you at least do it after you change all of this). I recommend to try simulating recovering it from the backup after you make sure you have one. I use [restic](https://github.com/restic/restic) for backups.

- Personal Info:
  - change your name to something random or just reuse your username as your name
  - gender:
    - set to 'rather not say'
    - choose who can see your gender: only you
  - alternate emails: remove all of those
  - phone number: remove all of these (it might seem like you can't remove it here, don't worry, it might work later when you remove it from 'security & sign in')
  - birthday - only you
  - set your home/work address as something totally random somewhere in your town, if you can't remove it
- Security & Sign In:
  - enable 2-step using an authenticator app (remove SMS for 2-Auth (less susceptible to [sim-swaps](https://en.wikipedia.org/wiki/SIM_swap_attack)))
  - your password should be random and not something you use elsewhere - save this in your password manager
  - remove recovery phone number
  - remove recovery emails
  - remove 2-step verification phones numbers
  - create backup codes (save these in your password manager)
  - skip password when possible: turn off
- Remove any third party apps/services you no longer use
- Data & Privacy
  - Stuff here should be relatively straightforward. Pause/Turn Everything Off, delete you activity (if you don't want to do all of it, at least set it to remove after 3/6 months)
  - My Ad Center: Turn Off
  - Personalization: Turn Off
  - ... and so on. (all of these you should not be storing any history/data, and have everything off)
- In 'People & Sharing'
  - Disable location sharing
  - Remove 'Save contact info when you interact with people'
  - Business Personalization - Off

Other stuff:

- I would recommend going to <https://payments.google.com> and click 'Close payments profile' (to disable your google pay account)
- Go to <https://mail.google.com> and setup mail forwarding to something else (see <https://www.privacyguides.org/en/email/> for recommendations). I would recommend setting it to forward and delete after forwarding (make sure to test this!)

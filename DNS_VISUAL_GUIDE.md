# Visual DNS Setup Guide

## The Flow: What Happens When Someone Visits Your Domain

```
Someone types: landeanalyse.no into their browser
              ↓
        Your DNS provider (domene.no) has records that say:
        "landeanalyse.no points to GitHub's servers"
              ↓
        GitHub Pages servers receive the request
        and serve your website
              ↓
        Visitor sees your website!
```

---

## Your DNS Configuration at domene.no

### What It Looks Like in Your DNS Settings

```
Domain: landeanalyse.no

TYPE    NAME    VALUE                          TTL
────────────────────────────────────────────────────
A       @       185.199.108.153                3600
A       @       185.199.109.153                3600
A       @       185.199.110.153                3600
A       @       185.199.111.153                3600
CNAME   www     hgrfrdk.github.io              3600
```

### Breaking It Down

**A Records (the 4 GitHub IPs):**
- These tell the DNS: "Send traffic for landeanalyse.no to these GitHub servers"
- You need all 4 for redundancy (if one fails, others still work)
- They all point to GitHub's data centers

**CNAME Record (www subdomain):**
- This tells DNS: "When someone visits www.landeanalyse.no, send them to GitHub Pages"
- **Important:** Must point directly to `hgrfrdk.github.io`, NOT to `landeanalyse.no`
- If you point www to the apex domain, GitHub cannot issue SSL certificates for both domains

---

## GitHub Pages Configuration

```
GitHub Settings:
┌─────────────────────────────────────────────────┐
│ Pages                                           │
├─────────────────────────────────────────────────┤
│ Custom domain: landeanalyse.no                  │
│ ✓ HTTPS enabled                                 │
│                                                 │
│ Status: Your site is published at               │
│ https://landeanalyse.no                         │
└─────────────────────────────────────────────────┘

Your Repository:
├── CNAME (contains: landeanalyse.no)
├── index.html
├── assets/
└── ... other files
```

---

## The Complete Setup Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      YOUR DOMAIN                                │
│                   landeanalyse.no                               │
│                                                                 │
│  Registrar: domene.no (gungir.domene.no)                       │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ DNS RECORDS                                          │      │
│  ├──────────────────────────────────────────────────────┤      │
│  │ A  @ → 185.199.108.153  }                            │      │
│  │ A  @ → 185.199.109.153  } GitHub Pages IPs         │      │
│  │ A  @ → 185.199.110.153  }                            │      │
│  │ A  @ → 185.199.111.153  }                            │      │
│  │                                                      │      │
│  │ CNAME www → hgrfrdk.github.io                       │      │
│  └──────────────────────────────────────────────────────┘      │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     │ DNS delegation
                     │
┌────────────────────▼─────────────────────────────────────────────┐
│              GITHUB PAGES (Free Hosting)                          │
│                                                                   │
│  Repository: LandeAnalyse                                         │
│  Branch: main                                                     │
│                                                                   │
│  Custom Domain Settings:                                          │
│  • landeanalyse.no (configured)                                   │
│  • HTTPS enabled                                                  │
│  • SSL certificate: Automatic (GitHub-managed)                    │
│                                                                   │
│  Public URL: https://landeanalyse.no                              │
└───────────────────────────────────────────────────────────────────┘
```

---

## Task Checklist: Who Does What

### You at domene.no control panel:
- [ ] Log in to gungir.domene.no
- [ ] Navigate to landeanalyse.no DNS settings
- [ ] Add 4 A records with GitHub IPs
- [ ] Add 1 CNAME record for www
- [ ] Save all records
- [ ] Verify they appear in your DNS list

### GitHub (automatic):
- [ ] CNAME file already created in repo
- [ ] GitHub validates DNS records (auto)
- [ ] GitHub issues SSL certificate (auto)
- [ ] Site becomes accessible (auto)

### You at GitHub Pages settings:
- [ ] Open repository Settings > Pages
- [ ] Enter custom domain: landeanalyse.no
- [ ] Wait for verification
- [ ] Enable HTTPS when available

---

## What Gets Connected

```
┌────────────────────┐           ┌──────────────────────┐
│  Visitor's Browser │           │   domene.no DNS      │
│                    │           │   (Your Registrar)   │
│  Types:            │─ Asks: ──→│                      │
│  landeanalyse.no   │ "Where is │   Records:           │
│                    │  this?"   │   A: 185.199.*.153   │
│                    │           │   CNAME: www → ...   │
└────────────────────┘           └─────────┬────────────┘
         ↑                                  │
         │                                  │ Responds:
         │ ← GitHub Pages found! ←─────────┤ "Go to GitHub
         │                                  │  at 185.199.*"
         │
         └──→ GitHub Pages loads
              your website
              ↓
         Website appears
         in browser
```

---

## DNS Propagation Timeline

```
Time:        What's Happening:                  You Can:
─────────────────────────────────────────────────────────────
0 sec        You add DNS records               Wait
             Records saved at domene.no

5 sec-       GitHub receives DNS records       Check GitHub
5 min        GitHub validates configuration     Pages settings
             GitHub issues SSL certificate

5 min-       Your local internet cache         Try visiting the
2 hours      updates with new DNS              domain

24 hours     All world DNS servers updated     (everything works
-48 hours    with your configuration           by now)

Note: Full propagation doesn't matter - your site works
as soon as your local area DNS updates (5 min to 2 hours)
```

---

## Why These Specific GitHub IPs?

The 4 IP addresses you're adding are GitHub's redundant servers:

```
185.199.108.153  ← US Data Center (East Coast)
185.199.109.153  ← Europe Data Center
185.199.110.153  ← Asia Data Center
185.199.111.153  ← Backup/Failover
```

If one fails, traffic automatically routes to the others. This ensures your site stays online even if GitHub has server issues.

---

## Common Questions Answered

### Q: Do I add www to the A records?
**A:** No. The A records use `@` (blank or @) which means the root domain. The CNAME record separately handles www.

### Q: What if domene.no uses different terminology?
**A:** You might see:
- "Vertsnavn" instead of "Host" or "Name"
- "Verdi" instead of "Value" or "IP"
- "Type" or "Posttype" for record type
The concept is the same - fill in Type, Name, and Value fields.

### Q: How long until it works?
**A:** Usually 5-30 minutes. Sometimes up to 2 hours. If not working after 2 hours, verify your records are correct.

### Q: Can I delete the old GitHub Pages URL (username.github.io)?
**A:** Yes, once your domain is fully working. Both URLs will work initially - you can delete the old one after confirming the new domain works.

### Q: What about email? Will email still work?
**A:** Email is separate from web hosting. Your email at your domain (if you have it) won't be affected by this change.

### Q: Why is "Enforce HTTPS" grayed out in GitHub Pages?
**A:** This usually means GitHub cannot issue an SSL certificate for all your domains. Common causes:
1. **www CNAME points to apex domain** - The www subdomain must point directly to `username.github.io`, NOT to your apex domain (e.g., landeanalyse.no). If www points to the apex, GitHub cannot validate it for SSL.
2. **DNS not fully propagated** - Wait 30-60 minutes after making DNS changes.
3. **CAA records blocking Let's Encrypt** - If you have CAA records, add `0 issue "letsencrypt.org"`.

To diagnose, check if HTTPS works on both domains:
```bash
curl -I https://landeanalyse.no
curl -I https://www.landeanalyse.no
```

### Q: My domain registrar offers free SSL. Should I use it?
**A:** No. GitHub Pages provides its own free SSL via Let's Encrypt. Using your registrar's SSL can cause conflicts. Make sure your registrar is only providing DNS services, not hosting or SSL proxying.

---

## You've Got This!

The setup is:
1. **5 DNS records** at your registrar
2. **1 GitHub setting** in Pages section
3. **Wait a few minutes** for propagation

That's it. Your domain is now connected to your GitHub Pages site.

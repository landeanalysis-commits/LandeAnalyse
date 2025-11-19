# Domain Connection Guide: landeanalyse.no + GitHub Pages

This guide walks you through connecting your domain to your GitHub Pages site. You'll complete tasks in two places: domene.no (DNS) and GitHub (GitHub Pages settings).

---

## Overview

When someone visits `landeanalyse.no`, the internet needs to know where to find your website. Here's what happens:

1. **DNS Configuration** (domene.no): Tell the domain registrar "send traffic to GitHub Pages"
2. **GitHub Configuration**: Tell GitHub "this site is hosted at landeanalyse.no"
3. **HTTPS Setup**: Enable secure connections automatically

---

## Part 1: DNS Configuration at domene.no

### Step 1: Access Your Control Panel

1. Go to: **gungir.domene.no** (your control panel)
2. Log in with your domene.no account credentials
3. You'll see your account dashboard

### Step 2: Find DNS Settings

From the main dashboard:
- Look for "Domener" (Domains) or "Min domener" (My Domains)
- Click on your domain: **landeanalyse.no**
- You should see several tabs/sections. Look for:
  - "DNS" or "DNS-innstillinger" (DNS Settings)
  - "Navneservere" (Name Servers)
  - "DNS-records" or "DNS-poster"

Click into the DNS management section.

### Step 3: Add GitHub Pages A Records

You need to add **4 A records** that point to GitHub's servers. These are the exact IPs GitHub Pages uses:

| Type | Name | IP Address | TTL |
|------|------|-----------|-----|
| A | @ (or leave blank) | 185.199.108.153 | 3600 |
| A | @ (or leave blank) | 185.199.109.153 | 3600 |
| A | @ (or leave blank) | 185.199.110.153 | 3600 |
| A | @ (or leave blank) | 185.199.111.153 | 3600 |

**How to add each A record:**

1. Find a button like "Legg til DNS-post" (Add DNS record) or "Ny post" (New record)
2. Select **Type: A**
3. In **Name/Host** field: Leave blank OR enter `@` (both mean "root domain")
4. In **Value/IP** field: Enter one of the four GitHub IPs (above)
5. **TTL**: 3600 (usually default)
6. Click **Save** or **Legg til** (Add)
7. **Repeat steps 1-6 three more times** for the other three IPs

**Important**: Add all 4 records. Don't replace - add separate entries.

### Step 4: Add CNAME Record for www Subdomain

After adding the A records, add one CNAME record for the www subdomain:

| Type | Name | Target | TTL |
|------|------|--------|-----|
| CNAME | www | landeanalyse.no | 3600 |

**How to add the CNAME record:**

1. Find "Legg til DNS-post" (Add DNS record) again
2. Select **Type: CNAME**
3. In **Name/Host** field: Enter `www`
4. In **Target/Value** field: Enter `landeanalyse.no`
5. **TTL**: 3600
6. Click **Save** or **Legg til** (Add)

### Step 5: Review Your DNS Records

After adding all records, your DNS should show:
- 4 A records (all pointing to GitHub IPs: 185.199.108/109/110/111.153)
- 1 CNAME record (www → landeanalyse.no)

---

## Part 2: GitHub Pages Configuration

The CNAME file has already been created in your repository. Now configure GitHub Pages:

### Step 1: Go to Your GitHub Repository Settings

1. Go to: **GitHub.com**
2. Navigate to your **LandeAnalyse** repository
3. Click **Settings** (top right)
4. In the left sidebar, look for **Pages** (under "Code and automation" section)
5. Click **Pages**

### Step 2: Configure Custom Domain

In the GitHub Pages settings:

1. Look for the **"Custom domain"** field
2. Enter: **landeanalyse.no** (without www)
3. Click **Save**

GitHub will automatically:
- Verify the DNS configuration
- Look for the CNAME file (already in your repo)
- Configure HTTPS

### Step 3: Enable HTTPS

After entering the custom domain:

1. Wait 30-60 seconds for GitHub to verify DNS
2. Look for the **"Enforce HTTPS"** checkbox
3. When it becomes available, **check the box** to enable HTTPS
4. This forces all visitors to use secure connections

---

## What's Already Done

✓ CNAME file created in repository: `/CNAME` (contains: landeanalyse.no)

---

## DNS Propagation & Timeline

**Immediate** (within 5 minutes):
- GitHub validates the DNS records
- HTTPS certificate is issued

**Short term** (5 minutes - 2 hours):
- Your domain starts working with GitHub Pages
- Visitors can access landeanalyse.no

**Full propagation** (24-48 hours):
- All internet DNS servers worldwide have updated information
- (This doesn't affect you - your site works immediately)

---

## Testing Your Setup

Once DNS is configured and GitHub Pages settings are saved:

1. Wait 2-5 minutes
2. Open a new browser tab
3. Visit: **https://landeanalyse.no**
4. You should see your website

If it doesn't work immediately:
- Refresh your browser (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache
- Try in a different browser or incognito window
- Wait a few more minutes - DNS can take up to 5 minutes to propagate locally

---

## What NOT to Do

You do NOT need to:
- Use phpMyAdmin (this is for databases, you don't have a database)
- Use CP Filbehandling/File Manager (GitHub manages your files)
- Configure any server settings in domene.no
- Create an additional website in the control panel

**You only need DNS settings** - everything else is automatic.

---

## Important Notes

- **No monthly costs**: Your site is hosted free on GitHub Pages
- **Automatic HTTPS**: GitHub provides free SSL certificates
- **Auto-updates**: When you push to GitHub, the site updates automatically
- **No server management**: You don't manage servers or PHP - it's static hosting

---

## Troubleshooting

### "Site can't be reached"
- DNS records take up to 5 minutes to activate
- Ensure all 4 A records are added correctly
- Check the CNAME record for www subdomain
- Hard refresh browser (Ctrl+F5)

### "DNS not resolving" in GitHub settings
- Wait another 2-3 minutes
- Verify all 4 A record IPs are correct (185.199.108/109/110/111.153)
- Make sure CNAME record has www pointing to landeanalyse.no

### HTTPS not available
- Wait 5-10 minutes after adding custom domain
- GitHub needs time to issue SSL certificate
- Check back in GitHub Pages settings

### www subdomain doesn't work
- Verify CNAME record is set: www → landeanalyse.no
- Wait 2-3 minutes for propagation

---

## Questions?

If something isn't clear:
1. Check GitHub's official guide: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
2. Check domene.no's documentation or contact their support
3. Ask for clarification on any step

---

## Summary Checklist

### At domene.no (gungir.domene.no):
- [ ] Added A record: 185.199.108.153
- [ ] Added A record: 185.199.109.153
- [ ] Added A record: 185.199.110.153
- [ ] Added A record: 185.199.111.153
- [ ] Added CNAME record: www → landeanalyse.no
- [ ] All records saved and visible in DNS list

### At GitHub:
- [ ] CNAME file exists in repository with "landeanalyse.no"
- [ ] Custom domain configured in GitHub Pages settings
- [ ] HTTPS enforcement enabled
- [ ] Site accessible at https://landeanalyse.no

---

**You're done!** Your domain is now connected to your GitHub Pages site.

---
# ============================================================
# CASE TEMPLATE — this folder is not published on the site.
#
# To add a case:
#   1. Copy this file into the _cases folder.
#   2. Rename it to the person's name, e.g. firstname-lastname.md
#      (the file name becomes the web address: /cases/firstname-lastname/)
#   3. Fill in the fields below and delete any you don't need.
#   4. Put the portrait in assets/img/cases/ and set "photo" below.
#   5. Commit. The case appears on the Cases page automatically.
#
# Tip: if a line contains a # (like "Campsite #2"), wrap the whole
# value in "double quotes", or everything after the # disappears.
# ============================================================

name: Firstname Lastname
order: 2                   # position on the Cases page (1 shows first)
age: 0                     # age at disappearance
status: Missing            # Missing, Murdered or Unidentified (drives the Cases page filter)
status_note: Missing since Month Year     # short line under the card, e.g. "Disappeared October 2, 1999"
photo: /assets/img/cases/firstname-lastname.jpg   # a 4:5 portrait crop, about 800x1000 px, works best
photo_alt: Firstname Lastname at age 0
last_seen: Month Day, Year
case_number: ""            # optional agency case number; delete the line if unknown
banner: /assets/img/scenes/ridge.jpg   # optional backdrop behind the name; ridge, pines or road

# ---------- Location section ----------
location:
  place: Town or trail, State
  detail: "Where the person was last seen, in a sentence or two."
  map_search: Place name, State     # used for the "Open in map" link
  # Or, for an exact pin, use coordinates instead of map_search:
  # lat: 40.0000
  # lng: -105.0000

# ---------- Synopsis section ----------
synopsis: |
  A short summary of the case, one or two paragraphs.

# ---------- Investigating agencies section ----------
# The first agency is the one named in the "Have information?" box.
agencies:
  - name: County Sheriff's Office
    role: Lead agency          # optional
    phone: "(000) 000-0000"    # optional; keep the quotes
    url: https://example.org   # optional
  - name: State Bureau of Investigation

# ---------- Overview tab: the chain of events ----------
# Add one "- date:" block per event, in order. Delete the section if not needed.
timeline:
  - date: Month Day, Year, 0:00 a.m.
    event: What happened at this point.
  - date: Month Day, Year
    event: What happened next.

# ---------- Case photos tab ----------
# Put images in assets/img/cases/. Use "photos: []" if there are none yet.
photos:
  - src: /assets/img/cases/firstname-lastname-1.jpg
    caption: What the photo shows, and when it was taken
  - src: /assets/img/cases/firstname-lastname-2.jpg
    caption: A photo that may be upsetting
    sensitive: true            # blurs the photo until a viewer chooses to see it

# ---------- Research tab ----------
# Links to documents, articles and records. Delete the section if not needed.
research:
  - title: Document title
    label: Rough draft         # optional short tag, e.g. Rough draft, Work in progress, Agency release
    description: One or two sentences on what the document covers.
    url: https://example.org/document

# Optional notes shown under the research links (Markdown).
research_notes: |
  ## Open questions

  1. A question the research is working to answer.
---

Write the full account of the case here, below the line above. It appears in the Overview tab under the timeline.

Leave a blank line between paragraphs. Use "## " at the start of a line for a heading, like this:

## A heading within the account

More of the account.

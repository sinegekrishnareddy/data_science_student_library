# Digital Library (Static Website)

A responsive, no-login student library built with plain HTML, CSS and JavaScript for the Mohan Babu University Data Science study workflow.

## Run locally

### Option 1 — Python local server (recommended)
1. Extract the ZIP file.
2. Open Terminal and `cd` into the extracted `data_science_student_library` folder.
3. Run:
   ```bash
   python3 -m http.server 8000
   ```
4. Open `http://localhost:8000` in your browser.

### Option 2 — open the file
Double-click `index.html`. Most pages work locally, but the Python runtime is more reliable through a local web server.

## What's implemented
- Responsive navigation and home dashboard.
- Five module cards and topic outlines.
- Five module outlines populated from the student-provided syllabus topics.
- Each module card has its own color theme for quick visual identification.
- PDFs for all five modules with native scrolling and PDF.js-powered two-page flip views, including a book-style spread-turn animation (requires internet access for PDF.js; run through a local web server to enable flip mode).
- PDFs attached directly to their relevant module pages.
- Lab page with 13 editable experiments, aims, procedures and browser-side Python execution through Pyodide. Pandas, Matplotlib, Seaborn and scikit-learn examples load their packages as needed; plotting examples render charts in the output panel.
- Data Science tools guide linked after the Lab & Python editor, with descriptions and official links for common programming, notebook, data, visualization, database, machine-learning, BI, collaboration and big-data tools.
- Data Science tool cards use locally stored brand logos and distinct accent colors inspired by each tool's familiar interface branding.
- Data Science faculty profile page with the supplied faculty information, expertise, contact links, institution and screenshot-captured metrics.
- Faculty page displays the supplied Bosubabu Sambana portrait.
- Faculty page displays the supplied Mohan Babu University logo in the current institution section.
- Supplied MBU logo is displayed in the sidebar brand and student profile card.
- Module-wise 2-mark and 8-mark question banks, downloadable as a text file, plus viva questions.
- Read-only student profile and personal ID-card mock-up populated with the configured student details and profile photo.
- Student profile academic details use distinct color accents for quick visual scanning.
- Personal details, address fields and social media links also use distinct color accents for quick visual scanning.
- Student profile includes the supplied LinkedIn, GitHub, LeetCode and Instagram links in its Social media section.
- Social media links use locally stored SVG icons.
- Study planner with checkboxes and due dates.
- Placement preparation guide with aptitude, reasoning, coding/DSA, SQL, data science, portfolio and interview topics, plus a suggested 8-week plan and links to practice resources.
- Dark mode.
- Export/import JSON backup and local reset.
- Browser `localStorage` persistence.

## Important limitations / not yet configured
1. **Official syllabus:** the five module outlines were entered from student-provided text and should be verified against the latest department-approved syllabus before academic submission.
2. **Python runtime:** Pyodide is loaded from `https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js`. First run requires internet access and access to that CDN. This is a browser runtime, not a secure server-side sandbox. Some Python packages may need extra setup.
3. **Static admin page:** no real admin authentication exists. Uploaded files, bookmarks and tasks are saved only in the current browser; they do not sync across users or devices. The displayed student profile is fixed in `app.js` and cannot be edited from the page.
4. **Storage:** uploaded files are limited to small files to reduce browser storage problems. For production, use a backend or cloud file storage.
5. **Student ID:** this is a personal mock-up, not an official university identity card.
6. **No real login/database:** intentionally omitted as requested.

## Update your syllabus
Open `app.js` and find `const modules = [...]`. Edit each module's `title`, `description` and `topics`. Keep the warning on the syllabus page until the module outline has been verified against the department-approved syllabus.

## Files
- `index.html` — page shell and navigation
- `styles.css` — responsive design and dark theme
- `app.js` — content, rendering, browser storage, Python runner and interactions

No build step or npm packages are required.

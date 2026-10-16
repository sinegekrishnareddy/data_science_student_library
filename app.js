/* Data Science Student Digital Library
   Static frontend: user-created items are stored in this browser using localStorage.
   The Python runner below uses Pyodide from a CDN; internet access is required for first load.
*/
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const STORAGE = "mbu-ds-library-v1";
const defaultProfile = {
 name:"SINEGE VENKATA KRISHNA REDDY",
 admissionNo:"MBUSOC/CSEDS156/2024",
 rollNo:"24102A030170",
 course:"B.Tech. - Computer Science and Engineering (Data Science)",
 admissionYear:"2024-2025",
 academicYear:"2026-2027",
 semester:"V-Semester",
 college:"Mohan Babu University",
 school:"School of Computing",
 department:"Data Science",
 curriculum:"Regular",
 title:"Mr.",
 photo:"assets/student-profile.jpg",
 dateOfBirth:"01-01-2007",
 gender:"Male",
 fatherName:"SINEGE SUBBA REDDY",
 motherName:"SINEGE PULLAMMA",
 address:"INDLACHERUVU, DONAKONDA MANDAL, PRAKASAM DIST, ANDHRA PRADESH, IN",
 city:"PRAKASAM DIST",
 state:"ANDHRA PRADESH"
};
const modules = [
 {id:1,title:"Introduction",icon:"◈",description:"Data science foundations, data preparation and analytical approaches.",topics:["Definition of data science","Skills for data science","Tools for data science","Data types","Data collections","Data preprocessing","Data analysis and data analytics","Descriptive analysis","Diagnostic analytics","Predictive analytics","Prescriptive analytics","Exploratory analysis","Mechanistic analysis"]},
 {id:2,title:"Data Extraction",icon:"⌘",description:"Extracting meaning from data, selecting features and reducing dimensionality.",topics:["Extracting meaning from data","Feature selection","User retention","Filters","Wrappers","Entropy","Decision tree algorithm","Random forests","The dimensionality problem","Single value decomposition","Principal component analysis"]},
 {id:3,title:"Data Visualization",icon:"▦",description:"Visualize data with Matplotlib, Pandas, Seaborn and other Python tools.",topics:["Brief Matplotlib API primer","Plotting with Pandas and Seaborn","Line plots","Bar plots","Distograms and density plots","Scatter plots","Facet grids and categorical data","Other Python visualization tools"]},
 {id:4,title:"Statistical Thinking",icon:"▥",description:"Explore distributions, probability, statistical summaries and distribution models.",topics:["Distributions","Representing and plotting histograms","Outliers","Summarizing distributions","Variance","Reporting results","Probability mass function (PMF)","Plotting PMFs","Other visualizations","The class size paradox","Data frame indexing","Cumulative distribution functions (CDFs)","Limits of PMFs","Representing CDFs","Percentile-based statistics","Random numbers","Comparing percentile ranks","Modeling distributions","Exponential distribution","Normal distribution","Lognormal distribution"]},
 {id:5,title:"Time Series Analysis and Predictive Modeling",icon:"✳",description:"Prepare and analyze time series data, then build and evaluate predictive models.",topics:["Time series analysis","Importing and cleaning","Plotting","Moving averages","Missing values","Serial correlation","Autocorrelation","Predictive modeling overview","Evaluating predictive models","Building predictive model solutions","Sentiment analysis"]}
];
const MODULE_PDFS = {
 1:{src:"assets/module-1-introduction-to-data-science.pdf",title:"Module 1 — Introduction to Data Science"},
 2:{src:"assets/module-2-data-collection-preprocessing.pdf",title:"Module 2 — Data Collection & Preprocessing"},
 3:{src:"assets/module-3-exploratory-data-analysis-visualization.pdf",title:"Module 3 — Exploratory Data Analysis & Visualization"},
 4:{src:"assets/module-4-statistics-machine-learning.pdf",title:"Module 4 — Statistics & Machine Learning"},
 5:{src:"assets/module-5-advanced-data-science-applications.pdf",title:"Module 5 — Advanced Data Science Applications"}
};
const PDFJS_SCRIPT_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_WORKER_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
let pdfJsPromise;
const modulePdfDocuments=new Map();
let modulePdfRenderId=0;
let modulePdfRenderTask;
const seedMaterials = [
 {id:"seed-m1",title:"Module 1 — Introduction to Data Science",type:"Notes",module:"1",description:"Topic outline and revision notes.",url:"",builtin:"m1"},
 {id:"seed-m2",title:"Python Fundamentals — Quick Reference",type:"Notes",module:"2",description:"Variables, loops, functions and collections.",url:"",builtin:"python"},
 {id:"seed-m3",title:"Data Cleaning Checklist",type:"Worksheet",module:"3",description:"A checklist for preparing datasets.",url:"",builtin:"clean"},
 {id:"seed-p1",title:"Sample Practice Paper — Data Science",type:"Question Paper",module:"1",description:"Practice questions for revision; not an official university paper.",url:"",builtin:"paper"},
 {id:"seed-v1",title:"Data Science Viva Starter Pack",type:"Viva",module:"1",description:"Frequently asked foundation questions.",url:"",builtin:"viva"}
];
const labs = [
 {id:"formats",title:"1. Working with different data formats using pandas",level:"Beginner",module:2,aim:"Read CSV, JSON and TSV data into Pandas DataFrames, inspect them, and export them to other formats.",procedure:["Create a small sample dataset as CSV, JSON and tab-separated text.","Read each format into a Pandas DataFrame.","Inspect the rows and columns to confirm the data loaded correctly.","Export the cleaned DataFrame as CSV and JSON."],code:`import pandas as pd
from io import StringIO

csv_text = """name,department,score
Asha,Data Science,88
Ravi,Computer Science,76
Meera,Data Science,93
"""
json_text = '[{"name":"Asha","score":88},{"name":"Ravi","score":76}]'
tsv_text = "name\\tscore\\nAsha\\t88\\nRavi\\t76\\n"

from_csv = pd.read_csv(StringIO(csv_text))
from_json = pd.read_json(StringIO(json_text))
from_tsv = pd.read_csv(StringIO(tsv_text), sep="\\t")

print("CSV data:\\n", from_csv.to_string(index=False))
print("\\nJSON data:\\n", from_json.to_string(index=False))
print("\\nTSV data:\\n", from_tsv.to_string(index=False))
print("\\nCSV export preview:\\n", from_csv.to_csv(index=False))
print("JSON export preview:\\n", from_csv.to_json(orient="records"))`},
 {id:"api-db",title:"2. Interacting with Web APIs and Databases",level:"Intermediate",module:2,aim:"Fetch JSON records from a public web API and save/query selected fields with SQLite.",procedure:["Request sample posts from the JSONPlaceholder API.","Check the HTTP response before processing the JSON.","Create an in-memory SQLite table and insert selected API fields.","Query the database and print matching records."],code:`import sqlite3
from pyodide.http import pyfetch

url = "https://jsonplaceholder.typicode.com/posts?_limit=5"
response = await pyfetch(url)
if not response.ok:
    raise RuntimeError(f"API request failed: HTTP {response.status}")
posts = await response.json()

connection = sqlite3.connect(":memory:")
connection.execute("CREATE TABLE posts (id INTEGER, title TEXT)")
connection.executemany(
    "INSERT INTO posts VALUES (?, ?)",
    [(post["id"], post["title"]) for post in posts]
)
for row in connection.execute("SELECT id, title FROM posts ORDER BY id"):
    print(row)
connection.close()`},
 {id:"clean",title:"3. Data Cleaning and Preparation",level:"Beginner",module:2,aim:"Clean a tabular dataset by fixing missing values, duplicate rows, inconsistent text and invalid measurements.",procedure:["Load the sample records into a DataFrame.","Normalize category text and convert measurements to numeric values.","Remove duplicate rows and mark invalid measurements as missing.","Fill remaining missing values with a documented statistic and review the result."],code:`import pandas as pd

df = pd.DataFrame({
    "name": ["Asha", "RAVI ", "Asha", "Meera", "Dev"],
    "city": ["Tirupati", "tirupati", "Tirupati", None, "Chennai"],
    "score": [88, 76, 88, None, 450]
})
print("Before cleaning:\\n", df.to_string(index=False))

df["name"] = df["name"].str.strip().str.title()
df["city"] = df["city"].str.strip().str.title()
df["score"] = pd.to_numeric(df["score"], errors="coerce")
df = df.drop_duplicates()
df.loc[~df["score"].between(0, 100), "score"] = float("nan")
df["city"] = df["city"].fillna("Unknown")
df["score"] = df["score"].fillna(df["score"].median())

print("\\nAfter cleaning:\\n", df.to_string(index=False))`},
 {id:"wrangling",title:"4. Data Wrangling",level:"Intermediate",module:2,aim:"Reshape, combine and summarize related tables to prepare them for analysis.",procedure:["Create customer and order tables as DataFrames.","Join orders to customer details using the customer key.","Reshape the joined data from long to wide format with a pivot.","Inspect the resulting table."],code:`import pandas as pd

customers = pd.DataFrame({
    "customer_id": [1, 2, 3],
    "segment": ["New", "Returning", "New"]
})
orders = pd.DataFrame({
    "customer_id": [1, 1, 2, 3],
    "product": ["Book", "Pen", "Book", "Pen"],
    "amount": [20, 5, 35, 8]
})
joined = orders.merge(customers, on="customer_id", how="left")
wide = joined.pivot_table(
    index=["customer_id", "segment"],
    columns="product",
    values="amount",
    aggfunc="sum",
    fill_value=0
)
print("Joined orders:\\n", joined.to_string(index=False))
print("\\nPivoted totals:\\n", wide.to_string())`},
 {id:"online-viz",title:"5. Matplotlib and Seaborn with an online dataset",level:"Intermediate",module:3,aim:"Download the Iris dataset and visualize relationships between measurements using Matplotlib and Seaborn.",procedure:["Fetch the public Iris CSV dataset from the Seaborn data repository.","Load the online CSV into a Pandas DataFrame and inspect sample rows.","Use Seaborn to plot sepal measurements, colored by species.","Render the chart and compare the species clusters."],code:`import base64
from io import BytesIO, StringIO
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import micropip
await micropip.install("seaborn")
import seaborn as sns
from pyodide.http import pyfetch

url = "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv"
response = await pyfetch(url)
if not response.ok:
    raise RuntimeError(f"Dataset download failed: HTTP {response.status}")
iris = pd.read_csv(StringIO(await response.string()))
print(iris.head().to_string(index=False))

sns.scatterplot(data=iris, x="sepal_length", y="sepal_width", hue="species")
plt.title("Iris measurements by species")
plt.tight_layout()
image = BytesIO()
plt.savefig(image, format="png", bbox_inches="tight")
print("__PLOT__" + base64.b64encode(image.getvalue()).decode())`},
 {id:"grouped-bars",title:"6. Grouped bar plots from a DataFrame",level:"Intermediate",module:3,aim:"Create side-by-side grouped bars to compare multiple values for each category.",procedure:["Create a DataFrame with categories as rows and series as columns.","Plot the DataFrame as a grouped bar chart.","Add axis labels, legend and title.","Render the chart and compare values within each category."],code:`import base64
from io import BytesIO
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

df = pd.DataFrame(
    {"2024": [18, 25, 14], "2025": [23, 20, 19], "2026": [28, 27, 24]},
    index=["Books", "Clothing", "Electronics"]
)
ax = df.plot(kind="bar", figsize=(8, 4), width=0.8)
ax.set(title="Sales by category and year", xlabel="Category", ylabel="Units sold")
plt.xticks(rotation=0)
plt.tight_layout()
image = BytesIO()
plt.savefig(image, format="png", bbox_inches="tight")
print("__PLOT__" + base64.b64encode(image.getvalue()).decode())`},
 {id:"stacked-bars",title:"7. Stacked bar plots from a DataFrame",level:"Intermediate",module:3,aim:"Create a stacked bar chart to compare totals and their component values across categories.",procedure:["Create a DataFrame where each column is a component of the total.","Plot the DataFrame as a stacked bar chart.","Label the axes and add a legend.","Render the chart and compare total heights and component shares."],code:`import base64
from io import BytesIO
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

df = pd.DataFrame(
    {"Online": [32, 24, 40], "Store": [18, 30, 22], "Partner": [10, 12, 8]},
    index=["North", "South", "West"]
)
ax = df.plot(kind="bar", stacked=True, figsize=(8, 4), colormap="viridis")
ax.set(title="Sales channels by region", xlabel="Region", ylabel="Orders")
plt.xticks(rotation=0)
plt.tight_layout()
image = BytesIO()
plt.savefig(image, format="png", bbox_inches="tight")
print("__PLOT__" + base64.b64encode(image.getvalue()).decode())`},
 {id:"time-series",title:"8. Time Series Analysis",level:"Intermediate",module:4,aim:"Parse dated observations, resample them by month and calculate a moving average.",procedure:["Create daily observations with a date column.","Parse dates and set the date column as the DataFrame index.","Resample the observations by month and calculate a rolling average.","Plot daily values and the smoothed trend."],code:`import base64
from io import BytesIO
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

df = pd.DataFrame({
    "date": pd.date_range("2026-01-01", periods=90, freq="D"),
    "visitors": [100 + (i % 14) * 3 + i // 5 for i in range(90)]
}).set_index("date")
monthly = df["visitors"].resample("MS").mean()
moving_average = df["visitors"].rolling(window=7).mean()
print("Monthly average visitors:\\n", monthly.round(1).to_string())

plt.plot(df.index, df["visitors"], alpha=0.4, label="Daily")
plt.plot(df.index, moving_average, label="7-day moving average")
plt.title("Website visitors over time")
plt.xlabel("Date")
plt.ylabel("Visitors")
plt.legend()
plt.tight_layout()
image = BytesIO()
plt.savefig(image, format="png", bbox_inches="tight")
print("__PLOT__" + base64.b64encode(image.getvalue()).decode())`},
 {id:"aggregation",title:"9. Data Aggregation",level:"Beginner",module:2,aim:"Group transaction records and compute multiple summary measures for each category.",procedure:["Load transaction rows into a DataFrame.","Group rows by region and product.","Calculate total sales, average sales and transaction count.","Review and sort the aggregated summary."],code:`import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "North", "South", "South", "North", "South"],
    "product": ["Book", "Pen", "Book", "Pen", "Book", "Book"],
    "amount": [120, 30, 90, 45, 80, 110]
})
summary = sales.groupby(["region", "product"]).agg(
    total_sales=("amount", "sum"),
    average_sale=("amount", "mean"),
    transactions=("amount", "count")
).sort_values("total_sales", ascending=False)
print(summary.to_string())`},
 {id:"scraping",title:"10. Web Scraping using Beautiful Soup",level:"Intermediate",module:3,aim:"Parse HTML with Beautiful Soup and extract structured text and links from a page.",procedure:["Load an example HTML page into Beautiful Soup.","Select repeated article elements with CSS selectors.","Extract and clean each title and link.","Print the scraped records as structured rows."],code:`from bs4 import BeautifulSoup

html = """
<html><body>
  <article class="book"><h2>Data Science Basics</h2><a href="/books/data">Details</a></article>
  <article class="book"><h2>Python for Analysis</h2><a href="/books/python">Details</a></article>
  <article class="book"><h2>Visual Analytics</h2><a href="/books/visual">Details</a></article>
</body></html>
"""
soup = BeautifulSoup(html, "html.parser")
for article in soup.select("article.book"):
    title = article.select_one("h2").get_text(strip=True)
    link = article.select_one("a")["href"]
    print({"title": title, "link": link})`},
 {id:"sentiment-scatter",title:"11. Scatter Intensity Plot of Sentiments",level:"Intermediate",module:3,aim:"Visualize sentiment polarity and intensity, using color strength to highlight sentiment magnitude.",procedure:["Create sample text records with polarity and intensity scores.","Map polarity to the horizontal axis and intensity to the vertical axis.","Use intensity as the scatter color value and add a color bar.","Render the plot and compare sentiment patterns."],code:`import base64
from io import BytesIO
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

sentiments = pd.DataFrame({
    "text": ["love this", "quite useful", "it is okay", "not good", "very upset", "excellent work"],
    "polarity": [0.95, 0.55, 0.05, -0.55, -0.9, 0.85],
    "intensity": [0.8, 0.45, 0.1, 0.5, 0.95, 0.7]
})
points = plt.scatter(
    sentiments["polarity"], sentiments["intensity"],
    c=sentiments["intensity"], cmap="coolwarm", s=130, edgecolors="black"
)
plt.colorbar(points, label="Sentiment intensity")
plt.axvline(0, color="gray", linestyle="--")
plt.xlabel("Sentiment polarity (negative to positive)")
plt.ylabel("Intensity")
plt.title("Sentiment polarity and intensity")
plt.tight_layout()
image = BytesIO()
plt.savefig(image, format="png", bbox_inches="tight")
print("__PLOT__" + base64.b64encode(image.getvalue()).decode())`},
 {id:"customer-personality",title:"12. Case Study: Customer Personality Analysis",level:"Intermediate",module:5,aim:"Compare customer segments to find which group has the strongest purchase activity for a targeted campaign.",procedure:["Create customer records with age, annual income, campaign response and spending.","Create transparent customer segments from age and income rules.","Group by segment and calculate response rate and average spending.","Identify a promising target segment; treat this small sample as a demonstration, not a business conclusion."],code:`import pandas as pd

customers = pd.DataFrame({
    "age": [22, 27, 31, 38, 45, 52, 29, 41, 60, 34],
    "income_k": [28, 35, 48, 72, 85, 92, 42, 78, 55, 68],
    "spending_score": [78, 82, 66, 48, 55, 38, 73, 62, 30, 70],
    "responded": [1, 1, 1, 0, 1, 0, 1, 1, 0, 1]
})
customers["segment"] = customers.apply(
    lambda row: "Young / lower income" if row.age < 30
    else ("Established / higher income" if row.income_k >= 65
          else "Other customers"),
    axis=1
)
summary = customers.groupby("segment").agg(
    customers=("responded", "size"),
    response_rate=("responded", "mean"),
    average_spending_score=("spending_score", "mean"),
    average_income_k=("income_k", "mean")
).sort_values("response_rate", ascending=False)
summary["response_rate"] *= 100
print(summary.round(1).to_string())
print("\\nUse segment results to guide a small, measurable campaign test.")`},
 {id:"text-emotions",title:"13. Case Study: Text Emotions Detection",level:"Intermediate",module:5,aim:"Train a text classifier that predicts an emotion and displays a matching emoji for a new message.",procedure:["Prepare short labeled example sentences for joy, sadness, anger and fear.","Convert the training text into TF-IDF features.","Train a Multinomial Naive Bayes classifier.","Predict the emotion for a new sentence and display its emoji."],code:`from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

training_text = [
    "I am so happy and excited", "This is wonderful news", "I love this so much",
    "I feel sad and lonely", "I miss you and feel down", "This is heartbreaking",
    "I am angry and frustrated", "That makes me furious", "I hate this situation",
    "I feel scared and worried", "This is frightening", "I am nervous and afraid"
]
labels = [
    "joy", "joy", "joy", "sadness", "sadness", "sadness",
    "anger", "anger", "anger", "fear", "fear", "fear"
]
emoji = {"joy": "😄", "sadness": "😢", "anger": "😠", "fear": "😨"}
model = make_pipeline(TfidfVectorizer(), MultinomialNB())
model.fit(training_text, labels)

message = "I am excited about the great news"
emotion = model.predict([message])[0]
print("Text:", message)
print("Predicted emotion:", emotion)
print("Suggested emoji:", emoji[emotion])
print("Demonstration only: a real emotion model needs a larger, diverse, reviewed dataset.")`}
];
const vivaQuestions = [
 ["What is data science?","Data science combines domain knowledge, statistics, programming and analytical methods to extract useful insights from data."],
 ["How is data science different from data analytics?","Data analytics often focuses on answering questions from existing data. Data science can include the wider lifecycle, including data collection, engineering and predictive model development."],
 ["What is structured data?","Data arranged in a defined schema, such as rows and columns in a relational table."],
 ["What is data preprocessing?","Preparing raw data by cleaning errors, handling missing values, transforming fields and making it suitable for analysis."],
 ["What is the difference between descriptive and predictive analytics?","Descriptive analytics summarizes what happened; predictive analytics estimates what may happen using patterns and models."],
 ["What is a Python list?","An ordered, mutable collection that can contain multiple items."],
 ["What is a Pandas DataFrame?","A two-dimensional labeled data structure with rows and columns, often used for tabular data."],
 ["How can missing values be handled?","Depending on context, remove affected rows or columns, fill values using a statistic, or use a domain-specific imputation method."],
 ["What is an outlier?","An observation unusually far from the general pattern of the data; it should be investigated, not automatically deleted."],
 ["What is the difference between correlation and causation?","Correlation describes association; it alone does not prove that one variable causes another."],
 ["What is supervised learning?","Learning from labeled examples to predict a target, commonly for classification or regression."],
 ["What is overfitting?","When a model learns training-specific noise and performs poorly on unseen data."],
 ["Why split data into train and test sets?","To estimate how well a model generalizes to unseen examples."],
 ["What is data visualization?","Representing data graphically to reveal patterns, comparisons, trends and unusual observations."],
 ["Why is data privacy important?","It helps prevent misuse or exposure of personal information and supports ethical, lawful data practices."]
];
const defaultState = {profile:defaultProfile,materials:seedMaterials,bookmarks:[],tasks:[{id:"t1",title:"Revise Module 1 definitions",date:"",done:false},{id:"t2",title:"Practice two Python lab programs",date:"",done:false},{id:"t3",title:"Prepare five viva answers",date:"",done:false}],theme:"light",activeModule:1};
let state;
try { state = {...defaultState, ...JSON.parse(localStorage.getItem(STORAGE)||"{}")}; } catch { state = {...defaultState}; }
state.profile = {...defaultProfile};
state.materials = Array.isArray(state.materials) ? state.materials : [...seedMaterials];
state.bookmarks = Array.isArray(state.bookmarks) ? state.bookmarks : [];
state.tasks = Array.isArray(state.tasks) ? state.tasks : [];
let currentPage = location.hash.replace("#","") || "home";
let toastTimer;
function save(){ try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch(e){notify("Browser storage is full. Try a smaller profile image.");} updateHeader(); }
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function initials(name){return (name||"Student").trim().split(/\s+/).slice(0,2).map(s=>s[0]||"").join("").toUpperCase()||"ST";}
function avatarHTML(cls="avatar"){return `<div class="${cls}">${state.profile.photo?`<img alt="Student photo" src="${state.profile.photo}">`:esc(initials(state.profile.name))}</div>`;}
function updateHeader(){ $("#miniName").textContent=state.profile.name||"Student Name";$("#topName").textContent=(state.profile.name||"Student").split(" ")[0];$("#miniAvatar").innerHTML=state.profile.photo?`<img alt="" src="${esc(state.profile.photo)}">`:esc(initials(state.profile.name));$("#topAvatar").innerHTML=state.profile.photo?`<img alt="" src="${esc(state.profile.photo)}">`:esc(initials(state.profile.name));document.body.classList.toggle("dark",state.theme==="dark");}
function notify(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600);}
const pageNames={home:"Overview",syllabus:"Modules & syllabus",labs:"Lab & Python editor",tools:"Data Science tools",faculty:"Data Science faculty",papers:"Question papers",viva:"Viva practice",bookmarks:"Bookmarks",planner:"Study planner",placement:"Placement prep",profile:"Student ID & profile",admin:"Admin / add materials"};
function heading(title,subtitle,button=""){return `<div class="page-heading"><div><div class="eyebrow">MBU · DATA SCIENCE</div><h1>${title}</h1><p>${subtitle}</p></div>${button}</div>`;}
function moduleCards(){return `<div class="module-grid">${modules.map(m=>`<article class="module-card"><div class="module-top"><span class="module-number">MODULE ${String(m.id).padStart(2,"0")}</span><span class="module-icon">${m.icon}</span></div><h3>${esc(m.title)}</h3><p>${esc(m.description)}</p><div class="module-footer"><span>${m.topics.length} topics listed</span><button data-module="${m.id}">Explore module ↗</button></div></article>`).join("")}</div>`;}
function resourceItem(m){let typeIcon={"Notes":"▤","PDF":"▧","Question Paper":"▥","Viva":"◇","Worksheet":"☷","Link":"↗"}[m.type]||"▤";const bookmarked=state.bookmarks.includes(m.id);return `<div class="resource"><div class="resource-icon">${typeIcon}</div><div class="resource-main"><strong>${esc(m.title)}</strong><small>${esc(m.type)} · ${m.module?`Module ${esc(m.module)}`:"General"} · ${esc(m.description||"")}</small></div><div class="resource-actions">${m.url?`<a class="btn btn-outline btn-small" href="${esc(m.url)}" target="_blank" rel="noopener">Open ↗</a>`:""}${m.fileData?`<a class="btn btn-outline btn-small" href="${m.fileData}" download="${esc(m.fileName||m.title)}">Download ↓</a>`:""}${m.builtin?`<button class="btn btn-outline btn-small" data-open-material="${esc(m.id)}">Read</button>`:""}<button class="btn ${bookmarked?"btn-cyan":"btn-outline"} btn-small" data-bookmark="${esc(m.id)}" aria-label="Toggle bookmark">${bookmarked?"★ Saved":"☆ Save"}</button></div></div>`;}
function empty(title,desc,icon="▤"){return `<div class="empty-state"><div class="big">${icon}</div><strong>${title}</strong><span>${desc}</span></div>`;}
function homePage(){return `${`<section class="hero"><div><div class="eyebrow">YOUR LEARNING SPACE</div><h1>Learn data. Discover insights.<br>Build your future.</h1><p>A focused digital library for your Data Science syllabus, practicals, exam revision and placement preparation.</p><div class="hero-actions"><a href="#syllabus" class="btn btn-cyan">Explore syllabus <span>↗</span></a><a href="#labs" class="btn btn-outline" style="background:#ffffff12;color:white;border-color:#ffffff25">Open Python lab</a></div></div><div class="hero-art"><div class="book-stack"><div class="book one">DATA</div><div class="book two">SCIENCE</div><div class="book three">LEARN</div></div></div></section>`}
<div class="stats-grid"><div class="stat-card"><div class="stat-icon">▤</div><div><strong>05</strong><small>Learning modules</small></div></div><div class="stat-card"><div class="stat-icon">⌘</div><div><strong>${labs.length}</strong><small>Python lab examples</small></div></div><div class="stat-card"><div class="stat-icon">☆</div><div><strong>${state.bookmarks.length}</strong><small>Saved bookmarks</small></div></div><div class="stat-card"><div class="stat-icon">☷</div><div><strong>${state.tasks.filter(t=>t.done).length}/${state.tasks.length}</strong><small>Planner tasks complete</small></div></div></div>
<div class="section-head"><h2>Explore your modules</h2><a href="#syllabus">View all modules ↗</a></div>${moduleCards()}
<div class="section-head"><h2>Quick access</h2></div><div class="two-col"><div class="panel"><h2>Continue learning</h2><div class="quick-list"><a class="quick-item" href="#labs"><div class="quick-icon">⌘</div><div><strong>Python practice lab</strong><small>Write code and see output</small></div><span class="arrow">↗</span></a><a class="quick-item" href="#papers"><div class="quick-icon">▥</div><div><strong>Question papers</strong><small>Practice with revision questions</small></div><span class="arrow">↗</span></a><a class="quick-item" href="#placement"><div class="quick-icon">↗</div><div><strong>Placement preparation</strong><small>DSA, SQL and interview roadmap</small></div><span class="arrow">↗</span></a></div></div><div class="panel"><h2>Study tip</h2><p class="muted">Learn one concept, implement it in Python, then explain it in your own words. Short daily practice builds stronger understanding than last-minute revision.</p><div class="notice"><strong>Academic content note</strong>Verify all module titles and topics against the latest syllabus issued by your department.</div></div></div>`;}
function syllabusPage(){return `${heading("Modules & syllabus","Explore the five-module course outline and topic lists.")}<div class="notice" style="margin:0 0 18px"><strong>Important: verify official syllabus</strong>This outline reflects the module titles and topics provided for this student library. Confirm it against the latest department-approved syllabus before academic submission.</div>${moduleCards()}<div class="panel spacer-top"><h2 id="moduleDetailTitle">Module details</h2><p class="muted">Choose “Explore module” on a card to view its topic list.</p><div id="moduleDetail"></div><button class="btn btn-outline btn-small spacer-top" id="printSyllabus">Print syllabus outline</button></div>`;}
function showModule(id){
 const m=modules.find(x=>x.id===Number(id));if(!m)return;
 state.activeModule=m.id;save();
 const box=$("#moduleDetail");
 if(!box)return;
 const modulePdf=MODULE_PDFS[m.id];
 box.innerHTML=`<div class="module-detail"><div><div class="eyebrow">MODULE ${m.id}</div><h3>${esc(m.title)}</h3><p class="muted">${esc(m.description)}</p><ol class="topic-list">${m.topics.map(t=>`<li>${esc(t)}</li>`).join("")}</ol></div><div class="panel" style="box-shadow:none;background:var(--surface2)"><h3>Module actions</h3><p class="muted">Save this module to bookmarks or jump to matching practicals and resources.</p><button class="btn btn-primary" data-bookmark-module="${m.id}">☆ Bookmark module</button><p class="spacer-top"><a class="link" href="#labs">Open related lab examples ↗</a></p></div></div>${modulePdf?`<section class="panel module-pdf" aria-labelledby="modulePdfTitle"><div class="module-pdf-header"><div><h3 id="modulePdfTitle">${esc(modulePdf.title)} PDF</h3><p class="muted">Read the attached course material by scrolling or flipping through pages.</p></div><div class="pdf-view-options" role="group" aria-label="PDF viewing mode"><button class="btn btn-cyan btn-small" type="button" data-pdf-mode="scroll" aria-pressed="true">Scroll</button><button class="btn btn-outline btn-small" type="button" data-pdf-mode="flip" aria-pressed="false">Flip pages</button><a class="btn btn-outline btn-small" href="${modulePdf.src}" download>Download PDF ↓</a></div></div><div id="modulePdfFlipControls" class="pdf-flip-controls hidden"><button class="btn btn-outline btn-small" type="button" data-pdf-page="-1" aria-label="Previous PDF page">← Previous</button><span id="modulePdfPageLabel" aria-live="polite">Page 1</span><button class="btn btn-outline btn-small" type="button" data-pdf-page="1" aria-label="Next PDF page">Next →</button></div><div id="modulePdfFlipView" class="module-pdf-flip-view hidden"><canvas id="modulePdfCanvas" aria-label="PDF page"></canvas></div><p id="modulePdfStatus" class="pdf-status hidden" role="status" aria-live="polite"></p><iframe id="modulePdfFrame" class="module-pdf-frame" src="${modulePdf.src}" title="${esc(modulePdf.title)} PDF" loading="lazy"></iframe></section>`:""}`;
 $("#moduleDetailTitle").textContent=m.title;
 $$("[data-bookmark-module]",box).forEach(button=>button.addEventListener("click",()=>toggleBookmark(`module-${button.dataset.bookmarkModule}`)));
 const pdfViewer=$(".module-pdf",box);
 if(!pdfViewer)return;
 let currentPdfPage=1;
 const frame=$("#modulePdfFrame",pdfViewer),controls=$("#modulePdfFlipControls",pdfViewer),flipView=$("#modulePdfFlipView",pdfViewer),pageLabel=$("#modulePdfPageLabel",pdfViewer),status=$("#modulePdfStatus",pdfViewer);
 const setMode=async mode=>{
  const flip=mode==="flip";
  controls.classList.toggle("hidden",!flip);
  flipView.classList.toggle("hidden",!flip);
  frame.classList.toggle("hidden",flip);
  status.classList.toggle("hidden",!flip);
  $$("[data-pdf-mode]",pdfViewer).forEach(button=>{const active=button.dataset.pdfMode===mode;button.classList.toggle("btn-cyan",active);button.classList.toggle("btn-outline",!active);button.setAttribute("aria-pressed",String(active));});
  if(flip)await renderModulePdfPage(m.id,currentPdfPage,pdfViewer);
 };
 $$("[data-pdf-mode]",pdfViewer).forEach(button=>button.addEventListener("click",()=>setMode(button.dataset.pdfMode)));
 $$("[data-pdf-page]",pdfViewer).forEach(button=>button.addEventListener("click",async()=>{currentPdfPage+=Number(button.dataset.pdfPage);await renderModulePdfPage(m.id,currentPdfPage,pdfViewer);}));
}
function loadPdfJs(){
 if(!pdfJsPromise)pdfJsPromise=new Promise((resolve,reject)=>{
  if(window.pdfjsLib){resolve(window.pdfjsLib);return;}
  const script=document.createElement("script");script.src=PDFJS_SCRIPT_URL;
  script.onload=()=>window.pdfjsLib?resolve(window.pdfjsLib):reject(new Error("PDF.js loaded but its API was unavailable."));
  script.onerror=()=>reject(new Error("Could not load PDF page viewer. Check your internet connection and CDN access."));
  document.head.appendChild(script);
 }).then(pdfjs=>{pdfjs.GlobalWorkerOptions.workerSrc=PDFJS_WORKER_URL;return pdfjs;});
 return pdfJsPromise;
}
async function renderModulePdfPage(moduleId,pageNumber,viewer){
 const status=$("#modulePdfStatus",viewer),canvas=$("#modulePdfCanvas",viewer),pageLabel=$("#modulePdfPageLabel",viewer),buttons=$$("[data-pdf-page]",viewer),renderId=++modulePdfRenderId,modulePdf=MODULE_PDFS[moduleId];
 modulePdfRenderTask?.cancel();
 status.classList.remove("hidden");status.textContent="Loading page…";buttons.forEach(button=>button.disabled=true);
 try{
  const pdfjs=await loadPdfJs();
  let pdfDocument=modulePdfDocuments.get(moduleId);
  if(!pdfDocument){pdfDocument=await pdfjs.getDocument(modulePdf.src).promise;modulePdfDocuments.set(moduleId,pdfDocument);}
  const page=Math.max(1,Math.min(pdfDocument.numPages,pageNumber));
  const pdfPage=await pdfDocument.getPage(page);
  const baseViewport=pdfPage.getViewport({scale:1}),container=$("#modulePdfFlipView",viewer),scale=Math.min((container.clientWidth-32)/baseViewport.width,(container.clientHeight-32)/baseViewport.height);
  const viewport=pdfPage.getViewport({scale:Math.max(.1,scale)}),pixelRatio=window.devicePixelRatio||1,context=canvas.getContext("2d");
  canvas.width=Math.ceil(viewport.width*pixelRatio);canvas.height=Math.ceil(viewport.height*pixelRatio);canvas.style.width=`${Math.ceil(viewport.width)}px`;canvas.style.height=`${Math.ceil(viewport.height)}px`;
  if(renderId!==modulePdfRenderId)return;
  modulePdfRenderTask=pdfPage.render({canvasContext:context,viewport,transform:pixelRatio===1?null:[pixelRatio,0,0,pixelRatio,0,0]});
  await modulePdfRenderTask.promise;
  if(renderId!==modulePdfRenderId)return;
  modulePdfRenderTask=null;
  pageLabel.textContent=`Page ${page} of ${pdfDocument.numPages}`;
  buttons.forEach(button=>{button.disabled=(button.dataset.pdfPage==="-1"&&page===1)||(button.dataset.pdfPage==="1"&&page===pdfDocument.numPages);});
  status.classList.add("hidden");
 }catch(error){
  if(renderId!==modulePdfRenderId)return;
  status.textContent=`Could not display this page: ${error.message}${location.protocol==="file:"?" Open the library through a local web server (for example, python3 -m http.server 8000) to enable page flipping.":""}`;
  console.error("Module 1 PDF page rendering failed:",error);
  buttons.forEach(button=>button.disabled=false);
 }
}
function labsPage(){return `${heading("Lab & Python editor","Choose an experiment to review its aim, procedure and code.")}<div class="notice" style="margin:0 0 17px"><strong>How the runner works</strong>Python runs in your browser using Pyodide. The first run needs internet access. Imported packages load automatically when available. Online API and dataset experiments also need an internet connection; network access may depend on the remote service's CORS policy.</div><div class="lab-layout"><div class="panel"><div class="field"><label for="labSelect">Choose a lab experiment</label><select id="labSelect">${labs.map(l=>`<option value="${l.id}">${esc(l.title)}</option>`).join("")}<option value="custom">Custom Python program</option></select></div><div class="panel lab-guide"><h2>Experiment guide</h2><p class="lab-guide-label">Aim</p><p id="labAim" class="muted">Select an experiment to see its aim.</p><p class="lab-guide-label">Procedure</p><ol id="labProcedure" class="lab-procedure"><li>Select an experiment to view its procedure.</li></ol></div><div class="split-heading"><h2>Python code</h2><span class="pill cyan">Python 3 · Browser</span></div><textarea id="codeEditor" class="code-editor" spellcheck="false" aria-label="Python code editor"></textarea><div class="code-actions"><button class="btn btn-cyan" id="runCode">▶ Run code</button><button class="btn btn-outline" id="resetCode">Reset example</button><button class="btn btn-outline" id="downloadCode">Download .py</button></div><div class="code-help">Plots generated with the __PLOT__ marker in these examples appear below the output.</div></div><div class="panel"><div class="split-heading"><h2>Output console</h2><button class="btn btn-outline btn-small" id="clearOutput">Clear</button></div><pre class="code-output" id="codeOutput">Your output will appear here.\n\nChoose a lab and select “Run code”.</pre><div id="plotOutput" class="plot-output" aria-live="polite"></div><div class="notice"><strong>Responsible use</strong>Do not paste passwords, API keys or private student data into code. Code runs in your browser but downloaded libraries may come from the internet.</div></div></div>`;}
function toolsPage(){const tools=[["Programming","Python","General-purpose language widely used for data analysis, automation and machine learning.","https://www.python.org/"],["Notebooks","Jupyter Notebook","Interactive documents for combining code, explanations, tables and visualizations.","https://jupyter.org/"],["Notebooks","Google Colab","Hosted notebooks for running Python in a browser, with optional access to cloud compute.","https://colab.research.google.com/"],["Data handling","NumPy","Numerical arrays and efficient mathematical operations in Python.","https://numpy.org/"],["Data handling","Pandas","Tabular data loading, cleaning, transformation and analysis.","https://pandas.pydata.org/"],["Visualization","Matplotlib","Flexible plotting library for charts and publication-style figures.","https://matplotlib.org/"],["Visualization","Seaborn","Statistical visualizations built on Matplotlib and Pandas.","https://seaborn.pydata.org/"],["Machine learning","Scikit-learn","Tools for preprocessing, model training, evaluation and traditional machine learning.","https://scikit-learn.org/"],["Databases","SQL","Query language for retrieving, combining and summarizing structured data.","https://www.postgresql.org/docs/current/"],["Business intelligence","Power BI","Microsoft platform for interactive reports and business dashboards.","https://powerbi.microsoft.com/"],["Business intelligence","Tableau","Visual analytics platform for exploring data and building dashboards.","https://www.tableau.com/"],["Collaboration","Git and GitHub","Version control and collaboration for tracking and sharing project code.","https://github.com/"],["Big data","Apache Spark","Distributed processing engine for working with large-scale datasets.","https://spark.apache.org/"]];return `${heading("Data Science tools","A practical guide to popular tools for collecting, analyzing, visualizing and sharing data.")}<div class="notice" style="margin:0 0 18px"><strong>Getting started</strong>Start with Python, Jupyter or Colab, NumPy, Pandas and Matplotlib. Add SQL for database work, then explore machine learning or dashboard tools as your projects need them.</div><div class="module-grid">${tools.map(([category,name,description,url])=>`<article class="module-card"><div class="module-top"><span class="module-number">${esc(category)}</span><span class="module-icon">↗</span></div><h3>${esc(name)}</h3><p>${esc(description)}</p><div class="module-footer"><span>External tool</span><a class="link" href="${url}" target="_blank" rel="noopener noreferrer">Visit official site ↗</a></div></article>`).join("")}</div><p class="inline-note spacer-top">Tools are selected as learning references. Availability, licensing and hardware requirements vary; check each official site for current details.</p>`;}
function facultyPage(){
 const skills=["Artificial Intelligence","Block Chain","Space Exploration","Internet of Things","Astronomy & Astrophysics","Cosmology"];
 return `<div class="page-heading"><div><div class="eyebrow">MBU · DATA SCIENCE</div><h1>Data Science faculty</h1></div></div><section class="panel"><div class="faculty-profile-head"><img class="faculty-portrait" src="assets/faculty-bosubabu-sambana.png" alt="Bosubabu Sambana with Dr. A. P. J. Abdul Kalam"><div class="faculty-profile-copy"><h2>Bosubabu Sambana</h2><p class="muted">Doctor of Philosophy (CSE) · Assistant Professor at Mohan Babu University</p><p><em>Innovator of the Internet Protocol Version 16 (IPv16), Computer Scientist</em></p><a class="btn btn-outline" href="mailto:bosukalam@gmail.com">Contact faculty ↗</a></div></div><div class="stats-grid"><div class="stat-card"><div class="stat-icon">▤</div><div><strong>165</strong><small>Publications (shown in supplied profile)</small></div></div><div class="stat-card"><div class="stat-icon">◉</div><div><strong>119,470</strong><small>Reads (shown in supplied profile)</small></div></div><div class="stat-card"><div class="stat-icon">◇</div><div><strong>182</strong><small>Citations (shown in supplied profile)</small></div></div></div></section><div class="two-col spacer-top"><section class="panel"><h2>Introduction</h2><p><a class="link" href="mailto:bosukalam@gmail.com">bosukalam@gmail.com</a></p><p><strong>YouTube channel:</strong> <a class="link" href="https://youtube.com/channel/UCorRAT8rYK7bF-QMOMRNKHw" target="_blank" rel="noopener noreferrer">Visit channel ↗</a></p><h3>Skills and expertise</h3><div class="toolbar">${skills.map(skill=>`<span class="pill">${esc(skill)}</span>`).join("")}</div></section><section class="panel"><h2>Current institution</h2><h3>Mohan Babu University</h3><p class="muted">Computer Science and Engineering (Data Science)</p><p><strong>Current position</strong><br>Assistant Professor</p><h3>Bosubabu Sambana's Lab</h3><p><a class="link" href="https://youtube.com/channel/UCorRAT8rYK7bF-QMOMRNKHw" target="_blank" rel="noopener noreferrer">YouTube channel ↗</a></p></section></div><p class="inline-note spacer-top">Publication, read and citation counts are reproduced from the supplied screenshot and may have changed since it was captured.</p>`;
}
function papersPage(){
 const questions=[
  {module:"Module 1 — Introduction",two:["Define data science.","Name any four skills useful for a data scientist.","Differentiate data analysis and data analytics.","What is data preprocessing?","Name the four types of data analytics.","What is exploratory data analysis (EDA)?","Distinguish structured and unstructured data.","What is mechanistic analysis?","Define descriptive analysis.","Why is data cleaning important?"],eight:["Explain the data science workflow, from problem definition and data collection to communication of results.","Compare descriptive, diagnostic, predictive and prescriptive analytics, giving an example of each.","Discuss the main skills and tools required for data science and explain how they support an end-to-end project.","Explain data types, data collections and preprocessing steps, with examples of handling missing, duplicate and inconsistent data."]},
  {module:"Module 2 — Data Extraction",two:["What is feature selection?","Differentiate filter and wrapper methods.","Define entropy in the context of a decision tree.","What is user retention?","What is the dimensionality problem?","What is a random forest?","Expand SVD and PCA.","What is a decision tree?","How does a filter method rank features?","State one advantage of using an ensemble model."],eight:["Explain filter and wrapper approaches to feature selection. Compare their process, computational cost and suitable use cases.","Describe how entropy and information gain are used to build a decision tree, using a small illustrative example.","Explain the dimensionality problem and discuss how SVD and principal component analysis reduce dimensions.","Describe the random forest algorithm and explain how it improves on a single decision tree."]},
  {module:"Module 3 — Data Visualization",two:["What is the purpose of Matplotlib?","Name two plot types used to compare categories.","What is a density plot?","When is a scatter plot useful?","What is a FacetGrid in Seaborn?","How can a Pandas DataFrame be plotted?","What does a histogram show?","Name one Python visualization library besides Matplotlib.","What is a categorical plot?","Why should plot axes be labeled?"],eight:["Explain the Matplotlib plotting workflow and demonstrate how to create and customize a line plot and a bar plot.","Compare histograms, density plots and scatter plots. State the data patterns each is useful for revealing.","Describe how Pandas and Seaborn can be used together to visualize an online dataset, including data loading and chart customization.","Explain the use of FacetGrid and categorical visualizations for comparing groups. Discuss good practices for clear and accessible charts."]},
  {module:"Module 4 — Statistical Thinking",two:["What is an outlier?","Define variance.","What is a probability mass function (PMF)?","What does a cumulative distribution function (CDF) represent?","Define percentile.","What is the class size paradox?","Name two measures used to summarize a distribution.","What is a probability distribution?","Name one continuous probability distribution.","What is a histogram?"],eight:["Explain how to summarize a distribution using graphical methods and numerical statistics, including the treatment of outliers and variance.","Describe PMFs and CDFs, explain how they differ, and show how percentiles can be obtained from a cumulative distribution.","Compare normal, lognormal and exponential distributions, describing the general shape and an example application for each.","Explain the class size paradox with an example, and discuss how data-frame indexing and percentile ranks can affect statistical interpretation."]},
  {module:"Module 5 — Time Series Analysis and Predictive Modeling",two:["What is a time series?","What is a moving average?","How can missing time-series values be handled?","Define autocorrelation.","What is serial correlation?","What is sentiment analysis?","Why should a predictive model be evaluated?","Name one metric used for classification.","What is a training dataset?","What is data leakage?"],eight:["Describe a time-series analysis workflow covering import, cleaning, plotting, missing values, moving averages and autocorrelation.","Explain serial correlation and autocorrelation, including how they can be identified and why they matter in time-series modeling.","Outline the steps for building and evaluating a predictive model. Explain the role of train/test separation and suitable evaluation metrics.","Describe a sentiment analysis workflow, from text preparation and feature representation to model evaluation, and discuss its limitations."]}
 ];
 const questionLists=questions.map(({module,two,eight})=>`<details class="question" open><summary>${esc(module)} <span class="pill">2-mark: ${two.length} · 8-mark: ${eight.length}</span></summary><div class="answer"><section class="question-group"><h3>2-mark questions</h3><ol data-question-section="${esc(module)} — 2-mark questions">${two.map(q=>`<li>${esc(q)}</li>`).join("")}</ol></section><section class="question-group"><h3>8-mark questions</h3><ol data-question-section="${esc(module)} — 8-mark questions">${eight.map(q=>`<li>${esc(q)}</li>`).join("")}</ol></section></div></details>`).join("");
 return `${heading("Question papers & exam practice","Practice module-wise 2-mark and 8-mark questions. These are generated practice questions, not official past papers.")}<div class="notice" style="margin:0 0 17px"><strong>Official papers</strong>No official university question paper PDFs were supplied. Upload authorized papers from Admin / add materials to make them available here.</div><div class="panel"><div class="section-head" style="margin-top:0"><h2>Module-wise practice set</h2><button class="btn btn-outline btn-small" id="downloadQuestions">Download question set</button></div><div id="papersQuestionBank">${questionLists}</div></div><div class="section-head"><h2>Uploaded question papers</h2></div><div class="resource-list">${state.materials.filter(m=>m.type==="Question Paper"||m.type==="PDF").map(resourceItem).join("")||empty("No uploaded papers yet","Add a PDF or paper link from the Admin page.")}</div>`;
}
function vivaPage(){return `${heading("Viva practice","Review common foundation questions and reveal suggested answers.")}<div class="toolbar"><input id="vivaSearch" type="search" placeholder="Search viva questions..."><span class="pill">${vivaQuestions.length} questions</span></div><div id="vivaList">${vivaQuestions.map((q,i)=>`<details class="question" data-question="${esc(q.join(" "))}"><summary><span class="pill cyan">Q${String(i+1).padStart(2,"0")}</span> ${esc(q[0])}</summary><div class="answer">${esc(q[1])}</div></details>`).join("")}</div>`;}
function bookmarksPage(){const ids=state.bookmarks;const mats=state.materials.filter(m=>ids.includes(m.id));const moduleIds=ids.filter(id=>String(id).startsWith("module-"));return `${heading("Your bookmarks","Quick access to saved resources and modules.")}<div class="section-head" style="margin-top:0"><h2>Saved materials</h2><span class="pill">${mats.length} items</span></div><div class="resource-list">${mats.length?mats.map(resourceItem).join(""):empty("No saved materials yet","Use the ☆ Save button on a resource to keep it here.","☆")}</div><div class="section-head"><h2>Saved modules</h2></div><div class="module-grid">${moduleIds.map(id=>modules.find(m=>`module-${m.id}`===id)).filter(Boolean).map(m=>`<article class="module-card"><span class="module-number">MODULE ${m.id}</span><h3>${esc(m.title)}</h3><p>${esc(m.description)}</p><div class="module-footer"><span>${m.topics.length} topics</span><button data-module="${m.id}">Explore ↗</button></div></article>`).join("")||empty("No modules saved","Bookmark a module from its detail panel.","☆")}</div>`;}
function plannerPage(){return `${heading("Study planner","Create a small, realistic plan and track your progress.",`<button class="btn btn-primary" id="addTaskTop">＋ Add task</button>`)}<div class="two-col"><div class="panel"><div class="split-heading"><h2>Your study tasks</h2><span class="pill">${state.tasks.filter(t=>t.done).length}/${state.tasks.length} complete</span></div><div style="height:6px;background:var(--surface2);border-radius:10px;overflow:hidden;margin:14px 0 10px"><div style="height:100%;width:${state.tasks.length?state.tasks.filter(t=>t.done).length/state.tasks.length*100:0}%;background:var(--cyan-dark)"></div></div><div id="taskList">${state.tasks.map(t=>`<div class="planner-item ${t.done?"done":""}"><input type="checkbox" data-task-done="${esc(t.id)}" ${t.done?"checked":""} aria-label="Mark ${esc(t.title)} complete"><div class="task-copy"><strong>${esc(t.title)}</strong><small>${t.date?`Due ${esc(t.date)}`:"No due date"}</small></div><button class="btn btn-outline btn-small" data-delete-task="${esc(t.id)}">Delete</button></div>`).join("")||empty("Your plan is clear","Add a task to begin.")}</div></div><div class="panel"><h2>Add a study task</h2><form id="taskForm"><div class="field"><label for="taskTitle">Task name</label><input id="taskTitle" required maxlength="120" placeholder="e.g. Revise NumPy indexing"></div><div class="field"><label for="taskDate">Due date (optional)</label><input id="taskDate" type="date"></div><button class="btn btn-cyan" type="submit">Add to planner</button></form><div class="notice"><strong>Study rhythm</strong>Try a 25-minute focus session, a 5-minute break, and a short recap from memory.</div></div></div>`;}
function placementPage(){
 const tracks=[
  {n:"01",title:"Quantitative aptitude",icon:"∑",description:"Build speed and accuracy in common placement-test problem types.",topics:["Percentages, ratios and proportions","Averages, mixtures and alligation","Profit, loss, discounts and simple/compound interest","Time and work; pipes and cisterns","Speed, distance and time; trains and boats","Number systems, divisibility and remainders","Permutations, combinations and probability","Data interpretation: tables, charts and caselets"],practice:"Solve timed sets, review every mistake, and keep a formula/error log."},
  {n:"02",title:"Logical reasoning and verbal ability",icon:"◇",description:"Prepare for reasoning, reading-comprehension and communication assessments.",topics:["Sequences, series and pattern recognition","Syllogisms, deductions and arrangements","Direction sense, ranking and blood relations","Puzzles and analytical reasoning","Reading comprehension and inference","Grammar, sentence correction and vocabulary","Clear written explanations and email etiquette"],practice:"Practice under a timer, then explain why each answer is correct."},
  {n:"03",title:"Programming and data structures",icon:"⌘",description:"Develop a dependable coding-interview foundation in Python or another chosen language.",topics:["Variables, control flow, functions and recursion","Strings, arrays/lists, dictionaries/maps and sets","Searching and sorting; binary search","Stacks, queues, linked lists and hash tables","Trees, heaps and graph traversal basics","Two pointers, sliding window and prefix sums","Time and space complexity using Big-O","Edge cases, testing and readable code"],practice:"Solve easy problems consistently before moving to medium difficulty. Explain the approach and complexity aloud.",resource:["Practice coding problems","https://leetcode.com/problemset/"]},
  {n:"04",title:"SQL and database fundamentals",icon:"▦",description:"Practice the database queries commonly used in software and data-role screens.",topics:["SELECT, WHERE, ORDER BY and LIMIT","Aggregate functions, GROUP BY and HAVING","INNER, LEFT and self joins","Subqueries and common table expressions","CASE expressions and NULL handling","Window functions: ROW_NUMBER, RANK and running totals","Keys, constraints, normalization and transactions"],practice:"Write queries against small sample tables and check results for duplicate and missing values.",resource:["Learn SQL interactively","https://sqlbolt.com/"]},
  {n:"05",title:"Data science and machine-learning fundamentals",icon:"▥",description:"Review the reasoning behind data preparation, statistical analysis and model evaluation.",topics:["Mean, median, variance, distributions and probability","Sampling, confidence intervals and hypothesis tests","Correlation versus causation; common sources of bias","Pandas data loading, cleaning, joins and aggregation","Feature engineering, train/validation/test splits","Regression, classification and clustering basics","Overfitting, regularization and cross-validation","Confusion matrix, precision, recall, F1 and ROC-AUC"],practice:"For each model or metric, explain what it measures, when it is useful and what can mislead it.",resource:["Kaggle Learn","https://www.kaggle.com/learn"]},
  {n:"06",title:"Resume, projects and portfolio",icon:"✳",description:"Present evidence of your skills through concise, reproducible project work.",topics:["Keep a focused one-page resume with accurate skills","Describe project impact with problem, method and result","Build 2–3 original projects relevant to target roles","Include a clear README, setup steps and sample outputs","Document data sources, assumptions and limitations","Use version control and keep repositories organized","Prepare a short demo and a 60–90 second project summary"],practice:"Be ready to explain your own contribution, trade-offs, evaluation, limitations and next improvement."},
  {n:"07",title:"Technical, HR and communication interviews",icon:"↗",description:"Practice explaining your thinking, experience and decisions clearly and honestly.",topics:["Introduce yourself in 60–90 seconds","Walk through one project from problem to outcome","Review programming, SQL and core subject fundamentals","Use STAR (Situation, Task, Action, Result) for experience questions","Practice debugging and thinking aloud","Prepare thoughtful questions for the interviewer","Discuss strengths, learning goals and challenges with examples"],practice:"Run mock interviews, record yourself, and improve one specific point after each session.",resource:["Interview preparation","https://www.interviewbit.com/interview-preparation/"]}
 ];
 const weeks=[
  ["Week 1","Python/programming fundamentals and aptitude baseline"],
  ["Week 2","Arrays, strings, hashing, searching and sorting"],
  ["Week 3","SQL queries, joins, aggregation and database basics"],
  ["Week 4","Statistics, probability and data interpretation"],
  ["Week 5","Core machine learning, evaluation and model limitations"],
  ["Week 6","Build or polish one portfolio project and resume"],
  ["Week 7","Timed coding/aptitude practice and technical mock interviews"],
  ["Week 8","HR practice, revision, company research and rest"]
 ];
 return `${heading("Placement preparation","A structured guide to aptitude tests, coding rounds, data roles, resumes and interviews.")}<div class="notice" style="margin:0 0 17px"><strong>Use this roadmap flexibly</strong>Start with 60–90 focused minutes a day. Prioritize the requirements in each target job description, track mistakes, and leave time for revision and rest.</div><div class="module-grid">${tracks.map(track=>`<article class="module-card"><div class="module-top"><span class="module-number">TRACK ${track.n}</span><span class="module-icon">${track.icon}</span></div><h3>${esc(track.title)}</h3><p>${esc(track.description)}</p><strong>Topics to prepare</strong><ul class="placement-topics">${track.topics.map(topic=>`<li>${esc(topic)}</li>`).join("")}</ul><p class="muted"><strong>Practice:</strong> ${esc(track.practice)}</p><div class="module-footer">${track.resource?`<a class="link" href="${track.resource[1]}" target="_blank" rel="noopener noreferrer">${esc(track.resource[0])} ↗</a>`:"<span>Study track</span>"}<button data-add-plan="${esc(track.title)}">Add to planner +</button></div></article>`).join("")}</div><div class="section-head"><h2>Suggested 8-week study plan</h2></div><div class="panel"><div class="resource-list">${weeks.map(([week,focus])=>`<div class="resource"><div class="resource-icon">☷</div><div class="resource-main"><strong>${esc(week)}</strong><small>${esc(focus)}</small></div><button class="btn btn-outline btn-small" data-add-plan="${esc(`${week}: ${focus}`)}">Add to planner +</button></div>`).join("")}</div></div><div class="section-head"><h2>Interview warm-up</h2><a href="#viva">Practice viva ↗</a></div><div class="panel"><h3>Project introduction template</h3><p><strong>Problem → data → approach → result → limitations → next improvement.</strong> Keep your first explanation under 90 seconds, then be ready to discuss technical details.</p><h3>Before the interview</h3><ul class="placement-topics"><li>Read the job description and review the skills it emphasizes.</li><li>Test your code, links and project demo before presenting.</li><li>Prepare examples that show teamwork, learning and problem solving.</li><li>Ask clear questions about the role and team.</li></ul><p class="muted">Represent your experience and results accurately. Do not claim projects, internships or skills you have not completed.</p></div>`;
}
function profilePage(){const p=state.profile;const detail=(label,value)=>`<div><small>${label}</small><strong>${esc(value)}</strong></div>`;return `${heading("Student ID & profile","Your student and academic details.")}<div class="profile-layout"><div><div class="id-card"><div class="id-head"><img class="college-seal mbu-seal-logo" src="assets/mbu-logo.png" alt="Mohan Babu University logo"><div><strong>${esc(p.college.toUpperCase())}</strong><small>STUDENT PROFILE · DATA SCIENCE</small></div></div><div class="id-body"><div class="id-photo">${p.photo?`<img src="${esc(p.photo)}" alt="${esc(p.name)}">`:esc(initials(p.name))}</div><div class="id-details">${detail("Student name",p.name)}${detail("Admission No.",p.admissionNo)}${detail("Roll No.",p.rollNo)}${detail("Semester",p.semester)}${detail("Department",p.department)}</div></div><div class="id-footer"><span>PERSONAL PROFILE · NOT AN OFFICIAL ID</span><span>DS / MBU</span></div></div><p class="inline-note spacer-top">This is a personal study profile mock-up, not a university-issued identity card.</p></div><div><div class="panel"><h2>Academic details</h2><div class="id-details profile-info">${detail("Course",p.course)}${detail("College",p.college)}${detail("School",p.school)}${detail("Department",p.department)}${detail("Semester",p.semester)}${detail("Academic year",p.academicYear)}${detail("Admission year",p.admissionYear)}${detail("Curriculum plan",p.curriculum)}</div></div><div class="panel spacer-top"><h2>Personal details</h2><div class="id-details profile-info">${detail("Title",p.title)}${detail("Date of birth",p.dateOfBirth)}${detail("Gender",p.gender)}${detail("Father's name",p.fatherName)}${detail("Mother's name",p.motherName)}</div></div><div class="panel spacer-top"><h2>Address</h2><div class="id-details profile-info">${detail("Address",p.address)}${detail("City / district",p.city)}${detail("State",p.state)}</div></div><div class="panel spacer-top"><h2>Social media</h2><div class="quick-list"><div class="quick-item"><div class="quick-icon">in</div><div><strong>LinkedIn</strong><small>Professional profile</small></div><a class="btn btn-outline btn-small" href="${esc(safeUrl("https://www.linkedin.com/in/venkata-krishna-reddy-sinege-73976231a/"))}" target="_blank" rel="noopener noreferrer">Open profile ↗</a></div><div class="quick-item"><div class="quick-icon">GH</div><div><strong>GitHub</strong><small>Code and project repository</small></div><a class="btn btn-outline btn-small" href="${esc(safeUrl("https://github.com/sinegekrishnareddy/krishnareddygithub"))}" target="_blank" rel="noopener noreferrer">Open profile ↗</a></div><div class="quick-item"><div class="quick-icon">LC</div><div><strong>LeetCode</strong><small>Problem-solving profile</small></div><a class="btn btn-outline btn-small" href="${esc(safeUrl("https://leetcode.com/u/sinegekrishnareddy/"))}" target="_blank" rel="noopener noreferrer">Open profile ↗</a></div><div class="quick-item"><div class="quick-icon">IG</div><div><strong>Instagram</strong><small>Social profile</small></div><a class="btn btn-outline btn-small" href="${esc(safeUrl("https://instagram.com/kittttuuuuu_18?srtk=MXRtaXF5OW43MnBqcg%3D%3D"))}" target="_blank" rel="noopener noreferrer">Open profile ↗</a></div></div></div></div></div>`;}
function safeUrl(s){try{const u=new URL(s);return ["https:","http:"].includes(u.protocol)?u.href:"#";}catch{return "#";}}
function adminPage(){return `${heading("Admin / add materials","Add resources to this browser's library. No server or login is configured.")}<div class="two-col"><div class="panel"><h2>Add a material or PDF</h2><form id="materialForm"><div class="field"><label for="mTitle">Resource title</label><input id="mTitle" required maxlength="150" placeholder="e.g. Module 2 Python notes"></div><div class="form-grid"><div class="field"><label for="mType">Resource type</label><select id="mType">${["Notes","PDF","Worksheet","Question Paper","Viva","Link"].map(t=>`<option>${t}</option>`).join("")}</select></div><div class="field"><label for="mModule">Module</label><select id="mModule"><option value="">General</option>${modules.map(m=>`<option value="${m.id}">Module ${m.id}</option>`).join("")}</select></div></div><div class="field"><label for="mDescription">Description</label><textarea id="mDescription" maxlength="400" placeholder="What will students learn from this resource?"></textarea></div><div class="field"><label for="mUrl">External resource URL (optional)</label><input id="mUrl" type="url" placeholder="https://..."></div><div class="field"><label for="mFile">Choose a local PDF or file (optional)</label><input id="mFile" type="file" accept=".pdf,.txt,.md,.csv,.py,application/pdf,text/plain,text/csv"><small class="muted">Small files are stored in local browser storage. Large files can exceed browser limits.</small></div><button class="btn btn-cyan" type="submit">＋ Save material</button></form></div><div class="panel"><h2>Local admin tools</h2><p class="muted">This is a static website, so this page is not protected by admin authentication. Anyone with access to this browser can add or remove local materials.</p><div class="quick-list"><div class="quick-item"><div class="quick-icon">⇩</div><div><strong>Export library data</strong><small>Download profile, tasks, bookmarks and material metadata as JSON.</small></div><button class="btn btn-outline btn-small" id="exportData">Export</button></div><div class="quick-item"><div class="quick-icon">⇧</div><div><strong>Import library data</strong><small>Restore a previously exported JSON file.</small></div><button class="btn btn-outline btn-small" id="importData">Import</button><input id="importFile" class="hidden" type="file" accept="application/json,.json"></div><div class="quick-item"><div class="quick-icon">↺</div><div><strong>Reset local data</strong><small>Remove changes saved in this browser.</small></div><button class="btn btn-danger btn-small" id="resetData">Reset</button></div></div><div class="notice"><strong>Not a multi-user CMS</strong>LocalStorage data stays in this browser and does not sync across devices. For a real admin panel with shared PDFs, user permissions and reliable storage, add a backend and database.</div></div></div><div class="section-head"><h2>Current resources</h2><span class="pill">${state.materials.length} items</span></div><div class="resource-list">${state.materials.map(m=>resourceItem(m)+(!m.id.startsWith("seed-")?`<div style="text-align:right;margin-top:-6px;margin-bottom:6px"><button class="btn btn-danger btn-small" data-delete-material="${esc(m.id)}">Remove this material</button></div>`:"")).join("")}</div>`;}
function render(page=currentPage){currentPage=pageNames[page]?page:"home";const content=$("#pageContent");$("#pageCrumb").textContent=pageNames[currentPage];$$(".nav-link").forEach(a=>a.classList.toggle("active",a.dataset.page===currentPage));const renderers={home:homePage,syllabus:syllabusPage,labs:labsPage,tools:toolsPage,faculty:facultyPage,papers:papersPage,viva:vivaPage,bookmarks:bookmarksPage,planner:plannerPage,placement:placementPage,profile:profilePage,admin:adminPage};content.innerHTML=renderers[currentPage]();content.focus({preventScroll:true});bindPageEvents();updateHeader();if(currentPage==="syllabus")showModule(state.activeModule||1);if(currentPage==="labs")loadLab(labs[0].id);}
function toggleBookmark(id){if(state.bookmarks.includes(id)){state.bookmarks=state.bookmarks.filter(x=>x!==id);notify("Removed from bookmarks.");}else{state.bookmarks.push(id);notify("Saved to bookmarks.");}save();render(currentPage);}
function bindPageEvents(){
 $$("[data-module]").forEach(b=>b.addEventListener("click",()=>{if(currentPage!=="syllabus"){location.hash="#syllabus";setTimeout(()=>showModule(b.dataset.module),60);}else showModule(b.dataset.module);}));
 $$("[data-bookmark]").forEach(b=>b.addEventListener("click",()=>toggleBookmark(b.dataset.bookmark)));
 $$("[data-bookmark-module]").forEach(b=>b.addEventListener("click",()=>toggleBookmark(`module-${b.dataset.bookmarkModule}`)));
 $$("[data-open-material]").forEach(b=>b.addEventListener("click",()=>openBuiltin(b.dataset.openMaterial)));
 $$("[data-delete-material]").forEach(b=>b.addEventListener("click",()=>{if(confirm("Remove this material from this browser?")){state.materials=state.materials.filter(m=>m.id!==b.dataset.deleteMaterial);state.bookmarks=state.bookmarks.filter(id=>id!==b.dataset.deleteMaterial);save();render(currentPage);notify("Material removed.");}}));
 if($("#printSyllabus"))$("#printSyllabus").addEventListener("click",()=>window.print());
 if($("#labSelect"))$("#labSelect").addEventListener("change",e=>loadLab(e.target.value));
 if($("#runCode"))$("#runCode").addEventListener("click",runPython);
 if($("#resetCode"))$("#resetCode").addEventListener("click",()=>loadLab($("#labSelect").value));
 if($("#downloadCode"))$("#downloadCode").addEventListener("click",downloadCode);
 if($("#clearOutput"))$("#clearOutput").addEventListener("click",()=>{$("#codeOutput").textContent="Output cleared.";$("#plotOutput")?.replaceChildren();});
 if($("#vivaSearch"))$("#vivaSearch").addEventListener("input",e=>{$$("[data-question]").forEach(q=>q.classList.toggle("hidden",!q.dataset.question.toLowerCase().includes(e.target.value.toLowerCase())));});
 if($("#taskForm"))$("#taskForm").addEventListener("submit",addTask);
 if($("#addTaskTop"))$("#addTaskTop").addEventListener("click",()=>$("#taskTitle")?.focus());
 $$("[data-task-done]").forEach(c=>c.addEventListener("change",()=>{const t=state.tasks.find(t=>t.id===c.dataset.taskDone);if(t)t.done=c.checked;save();render("planner");}));
 $$("[data-delete-task]").forEach(b=>b.addEventListener("click",()=>{state.tasks=state.tasks.filter(t=>t.id!==b.dataset.deleteTask);save();render("planner");}));
 $$("[data-add-plan]").forEach(b=>b.addEventListener("click",()=>{state.tasks.push({id:crypto.randomUUID(),title:b.dataset.addPlan,date:"",done:false});save();notify("Added to your planner.");}));
 if($("#materialForm"))$("#materialForm").addEventListener("submit",addMaterial);
 if($("#exportData"))$("#exportData").addEventListener("click",exportData);
 if($("#importData"))$("#importData").addEventListener("click",()=>$("#importFile").click());
 if($("#importFile"))$("#importFile").addEventListener("change",importData);
 if($("#resetData"))$("#resetData").addEventListener("click",resetData);
 if($("#downloadQuestions"))$("#downloadQuestions").addEventListener("click",downloadQuestions);
}
function openBuiltin(id){const m=state.materials.find(x=>x.id===id);const builtin=m?.builtin;if(!builtin)return;const body={
 m1:"MODULE 1 — INTRODUCTION TO DATA SCIENCE\n\nData science combines programming, statistics and domain knowledge to learn from data.\n\nKey topics:\n• Definition and skills for data science\n• Tools and data types\n• Data collections and preprocessing\n• Data analysis and analytics\n• Descriptive, diagnostic, predictive and prescriptive analytics\n\nRevision: descriptive = what happened; diagnostic = why it happened; predictive = what may happen; prescriptive = what action may help.",
 python:"PYTHON QUICK REFERENCE\n\nname = 'Data Science'\nmarks = [70, 80, 90]\nstudent = {'name': 'Asha', 'marks': 85}\n\n# List: ordered and mutable\n# Tuple: ordered and immutable\n# Set: unique elements\n# Dictionary: key-value pairs\n\ndef average(values):\n    return sum(values) / len(values) if values else 0\n\nprint(average(marks))",
 clean:"DATA CLEANING CHECKLIST\n\n1. Inspect rows, columns and data types.\n2. Check missing values and decide how to handle them.\n3. Find duplicate records.\n4. Validate ranges and categories.\n5. Investigate outliers before removing them.\n6. Standardize formats and units.\n7. Keep a record of changes.\n8. Compare summary statistics before and after cleaning.",
 paper:"SAMPLE PRACTICE PAPER — NOT OFFICIAL\n\n1. Define data science and list its key skills.\n2. Explain the four types of analytics with examples.\n3. Describe structured and unstructured data.\n4. Explain why data preprocessing is important.\n5. Write a Python program to find the average of a list.\n6. Explain correlation and causation.\n7. Compare supervised and unsupervised learning.",
 viva:vivaQuestions.map((q,i)=>`${i+1}. ${q[0]}\n${q[1]}`).join("\n\n")
};const win=window.open("","_blank");if(!win){notify("Pop-up blocked. Allow pop-ups to read this material.");return;}win.document.write(`<title>${esc(m.title)}</title><meta charset="utf-8"><style>body{font:16px/1.7 system-ui;max-width:800px;margin:40px auto;padding:0 22px;white-space:pre-wrap;color:#15243b}</style><h1>${esc(m.title)}</h1><pre style="white-space:pre-wrap;font:inherit">${esc(body[builtin]||"")}</pre>`);win.document.close();}
function loadLab(id){const lab=labs.find(l=>l.id===id);if($("#codeEditor"))$("#codeEditor").value=lab?lab.code:"# Write your Python code here\nprint('Hello, Data Science!')";if($("#labAim"))$("#labAim").textContent=lab?lab.aim:"Write and run your own Python program.";if($("#labProcedure"))$("#labProcedure").innerHTML=lab?lab.procedure.map(step=>`<li>${esc(step)}</li>`).join(""):"<li>Write your code in the editor and run it.</li>";if($("#codeOutput")&&id!=="custom")$("#codeOutput").textContent="Ready. Select “Run code” to execute this program.";if($("#plotOutput"))$("#plotOutput").replaceChildren();}
let pyodidePromise;
async function getPyodide(){if(!pyodidePromise){pyodidePromise=(async()=>{if(!window.loadPyodide){await new Promise((resolve,reject)=>{const script=document.createElement("script");script.src="https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js";script.onload=resolve;script.onerror=()=>reject(new Error("Could not load Python runtime. Check your internet connection and CDN access."));document.head.appendChild(script);});}return await window.loadPyodide();})();}return pyodidePromise;}
async function runPython(){const btn=$("#runCode"),out=$("#codeOutput"),plotOutput=$("#plotOutput"),code=$("#codeEditor").value;btn.disabled=true;btn.textContent="Loading / running…";out.textContent="Starting Python runtime…";plotOutput.replaceChildren();try{const py=await getPyodide();let captured="";py.setStdout({batched:s=>captured+=s+"\n"});py.setStderr({batched:s=>captured+=s+"\n"});try{if(py.loadPackagesFromImports)await py.loadPackagesFromImports(code);await py.runPythonAsync(code);const plots=[...captured.matchAll(/^__PLOT__([A-Za-z0-9+/=]+)$/gm)];for(const match of plots){const image=document.createElement("img");image.alt="Plot generated by the Python experiment";image.src=`data:image/png;base64,${match[1]}`;plotOutput.append(image);}const text=captured.replace(/^__PLOT__[A-Za-z0-9+/=]+$/gm,"").trim();out.textContent=text||(!plots.length?"Program completed with no printed output.":"Plot rendered below.");}catch(err){out.textContent=(captured?captured:"")+String(err);} }catch(err){out.textContent=String(err)+"\n\nIf you opened this file directly, try serving the folder with: python3 -m http.server 8000";}finally{btn.disabled=false;btn.textContent="▶ Run code";}}
function downloadCode(){const blob=new Blob([$("#codeEditor").value],{type:"text/x-python"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="data_science_lab.py";a.click();URL.revokeObjectURL(a.href);}
function downloadText(name,text){const blob=new Blob([text],{type:"text/plain;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href);}
function downloadQuestions(){const sections=$$("#papersQuestionBank [data-question-section]");const text=sections.map(section=>`${section.dataset.questionSection}\n${[...section.querySelectorAll("li")].map((item,index)=>`${index+1}. ${item.innerText}`).join("\n")}`).join("\n\n");downloadText("data_science_practice_questions.txt","DATA SCIENCE PRACTICE QUESTIONS\n\n"+text);}
function addTask(e){e.preventDefault();const title=$("#taskTitle").value.trim();if(!title)return;state.tasks.push({id:crypto.randomUUID(),title,date:$("#taskDate").value,done:false});save();render("planner");notify("Study task added.");}
function readFile(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});}
async function addMaterial(e){e.preventDefault();const file=$("#mFile").files[0];let fileData="";if(file){if(file.size>1_500_000){notify("File is over 1.5 MB. Add a hosted URL instead to avoid browser storage issues.");return;}fileData=await readFile(file);}const url=$("#mUrl").value.trim();if(url&&!safeUrl(url).startsWith("http")){notify("Enter a valid http or https URL.");return;}const material={id:"mat-"+crypto.randomUUID(),title:$("#mTitle").value.trim(),type:$("#mType").value,module:$("#mModule").value,description:$("#mDescription").value.trim(),url:url?safeUrl(url):"",fileData,fileName:file?.name||"",builtin:""};state.materials.unshift(material);save();notify("Material saved locally.");render("admin");}
function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="mbu-data-science-library-backup.json";a.click();URL.revokeObjectURL(a.href);notify("Backup exported.");}
async function importData(e){const file=e.target.files[0];if(!file)return;try{const parsed=JSON.parse(await file.text());if(!parsed||typeof parsed!=="object"||!Array.isArray(parsed.materials)||!Array.isArray(parsed.tasks))throw new Error("This does not look like a library backup.");state={...defaultState,...parsed,profile:{...defaultProfile}};save();render(currentPage);notify("Library backup imported.");}catch(err){notify("Import failed: "+err.message);}e.target.value="";}
function resetData(){if(!confirm("Reset this website's saved profile, bookmarks, tasks and materials in this browser? This cannot be undone unless you exported a backup."))return;localStorage.removeItem(STORAGE);state={...defaultState,profile:{...defaultProfile},materials:[...seedMaterials],bookmarks:[],tasks:[...defaultState.tasks]};save();render("home");notify("Local library reset.");}
function navigate(){const page=location.hash.replace("#","")||"home";render(page);$("#sidebar").classList.remove("open");}
window.addEventListener("hashchange",navigate);
$("#themeToggle").addEventListener("click",()=>{state.theme=state.theme==="dark"?"light":"dark";save();notify(`${state.theme==="dark"?"Dark":"Light"} mode enabled.`);});
$("#menuToggle").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#profileShortcut").addEventListener("click",()=>location.hash="#profile");
document.addEventListener("click",e=>{if(e.target.closest("a.nav-link")&&window.innerWidth<850)$("#sidebar").classList.remove("open");});
updateHeader();render(currentPage);

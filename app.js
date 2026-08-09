
let SETTINGS = {};
let allCourses = [];
let activeCategory = "All";
let activeCollection = "All";

const $ = (s) => document.querySelector(s);
const courseGrid = $("#courseGrid");
const searchInput = $("#searchInput");
const emptyState = $("#emptyState");
const clearFilter = $("#clearFilter");

function safeText(v){ return (v ?? "").toString(); }

function telegramUrl(course = null){
  const username = safeText(course?.telegramUsername || SETTINGS.telegramUsername).replace("@","");
  const message = safeText(
    course?.telegramMessage ||
    (course ? `Hi, I am interested in "${course.title}" by ${course.creator}. Please share details.` : SETTINGS.defaultTelegramMessage)
  );
  return `https://t.me/${username}?text=${encodeURIComponent(message)}`;
}

async function loadJSON(path){
  const res = await fetch(path, {cache:"no-store"});
  if(!res.ok) throw new Error(`Could not load ${path}`);
  return res.json();
}

async function init(){
  try{
    [SETTINGS, allCourses] = await Promise.all([
      loadJSON("data/settings.json"),
      loadJSON("data/courses.json")
    ]);

    document.title = `${SETTINGS.brandName} — Learn Skills That Move You Forward`;
    document.querySelectorAll(".brand span:last-child").forEach(el => el.textContent = SETTINGS.brandName);

    ["#navTelegram","#heroTelegram","#ctaTelegram","#footerTelegram"].forEach(sel=>{
      const el = $(sel);
      if(el) el.href = telegramUrl();
    });

    renderCategories();
    renderPopularSearches();
    renderCollections();
    populateFilters();
    applyFilters();
  }catch(err){
    console.error(err);
    courseGrid.innerHTML = `
      <div class="empty-state">
        <h3>Course data could not load.</h3>
        <p>Open this website through GitHub Pages, Netlify, Cloudflare Pages or a local web server.</p>
      </div>`;
  }
}

function renderPopularSearches(){
  const tags = SETTINGS.homepage?.popularSearches || [];
  const wrap = $("#popularSearches");
  wrap.innerHTML = tags.map(t=>`<button data-search="${t}">${t}</button>`).join("");
  wrap.querySelectorAll("button").forEach(btn=>{
    btn.addEventListener("click",()=>{
      searchInput.value = btn.dataset.search;
      activeCategory = "All";
      activeCollection = "All";
      resetSelects(false);
      applyFilters();
    });
  });
}

function renderCategories(){
  const counts = {};
  allCourses.forEach(c => counts[c.category] = (counts[c.category] || 0) + 1);
  const icons = {
    "AI":"✦","Video Editing":"◈","Digital Marketing":"◎","Coding":"⌘",
    "Spoken English":"◌","Freelancing":"↗","Graphic Design":"◇","Business":"▦"
  };
  const grid = $("#categoryGrid");
  grid.innerHTML = Object.entries(counts).map(([name,count])=>`
    <article class="category-card" data-category="${name}">
      <div class="icon">${icons[name] || "✧"}</div>
      <h3>${name}</h3>
      <p>${count} course${count>1?"s":""}</p>
    </article>
  `).join("");

  grid.querySelectorAll(".category-card").forEach(card=>{
    card.addEventListener("click",()=>{
      activeCategory = card.dataset.category;
      activeCollection = "All";
      searchInput.value = "";
      $("#categoryFilter").value = activeCategory;
      clearFilter.classList.remove("hidden");
      applyFilters();
      document.querySelector("#courses").scrollIntoView({behavior:"smooth"});
    });
  });
}

function renderCollections(){
  if(document.querySelector("#collectionFilters")) return;
  const filters = document.createElement("div");
  filters.id = "collectionFilters";
  filters.className = "collection-filters";
  filters.innerHTML = `
    <button data-collection="All" class="active">All</button>
    <button data-collection="Trending">Trending</button>
    <button data-collection="BestSeller">Best Seller</button>
    <button data-collection="Featured">Featured</button>
    <button data-collection="Recent">Recently Added</button>
  `;
  const coursesSection = document.querySelector("#courses .section-head");
  if(coursesSection) coursesSection.insertAdjacentElement("afterend", filters);

  filters.querySelectorAll("button").forEach(btn=>{
    btn.addEventListener("click",()=>{
      activeCollection = btn.dataset.collection;
      filters.querySelectorAll("button").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      clearFilter.classList.toggle("hidden", activeCollection === "All");
      applyFilters();
    });
  });
}

function populateFilters(){
  const categories = [...new Set(allCourses.map(c=>c.category))].sort();
  const creators = [...new Set(allCourses.map(c=>c.creator))].sort();

  $("#categoryFilter").innerHTML =
    `<option value="All">All categories</option>` +
    categories.map(x=>`<option value="${x}">${x}</option>`).join("");

  $("#creatorFilter").innerHTML =
    `<option value="All">All creators</option>` +
    creators.map(x=>`<option value="${x}">${x}</option>`).join("");
}

function courseCard(c){
  return `
    <article class="course-card" data-id="${c.id}">
      <div class="course-image-wrap">
        <img class="course-image" src="${c.image}" alt="${c.title}" loading="lazy">
        <div class="course-overlay-tags">
          ${c.trending ? `<span>Trending</span>` : ""}
          ${c.bestSeller ? `<span>Best Seller</span>` : ""}
        </div>
      </div>
      <div class="course-content">
        <div class="course-top">
          <span class="pill">${c.category}</span>
          ${c.badge ? `<span class="badge">${c.badge}</span>` : ""}
        </div>
        <h3>${c.title}</h3>
        <p class="creator">by ${c.creator}</p>
        <div class="course-stats">
          <span>★ ${Number(c.rating || 0).toFixed(1)}</span>
          <span>${c.reviews || 0} reviews</span>
          <span>${c.level || "All Levels"}</span>
        </div>
        <div class="price-row">
          ${c.oldPrice ? `<span class="old-price">${c.oldPrice}</span>` : ""}
          <span class="price">${c.price}</span>
        </div>
      </div>
    </article>
  `;
}

function getFilteredCourses(){
  const q = searchInput.value.trim().toLowerCase();
  const cat = $("#categoryFilter").value;
  const creator = $("#creatorFilter").value;
  const level = $("#levelFilter").value;
  const price = $("#priceFilter").value;
  const sort = $("#sortFilter").value;

  let list = [...allCourses];

  if(activeCategory !== "All") list = list.filter(c => c.category === activeCategory);
  if(cat !== "All") list = list.filter(c => c.category === cat);
  if(creator !== "All") list = list.filter(c => c.creator === creator);
  if(level !== "All") list = list.filter(c => c.level === level);

  if(activeCollection === "Trending") list = list.filter(c => c.trending);
  if(activeCollection === "BestSeller") list = list.filter(c => c.bestSeller);
  if(activeCollection === "Featured") list = list.filter(c => c.featured);
  if(activeCollection === "Recent") list = list.filter(c => c.recentlyAdded);

  if(price === "0-499") list = list.filter(c => Number(c.priceValue || 0) <= 499);
  if(price === "500-699") list = list.filter(c => Number(c.priceValue || 0) >= 500 && Number(c.priceValue || 0) <= 699);
  if(price === "700+") list = list.filter(c => Number(c.priceValue || 0) >= 700);

  if(q){
    list = list.filter(c =>
      [
        c.title,c.creator,c.category,c.description,c.badge,c.slug,c.level,
        ...(c.tags || [])
      ].join(" ").toLowerCase().includes(q)
    );
  }

  if(sort === "price-low") list.sort((a,b)=>(a.priceValue||0)-(b.priceValue||0));
  if(sort === "price-high") list.sort((a,b)=>(b.priceValue||0)-(a.priceValue||0));
  if(sort === "rating") list.sort((a,b)=>(b.rating||0)-(a.rating||0));
  if(sort === "newest") list.sort((a,b)=>Number(Boolean(b.recentlyAdded))-Number(Boolean(a.recentlyAdded)));

  return list;
}

function renderCourses(list){
  courseGrid.innerHTML = list.map(courseCard).join("");
  emptyState.classList.toggle("hidden", list.length !== 0);
  $("#resultCount").textContent = `${list.length} course${list.length===1?"":"s"}`;

  courseGrid.querySelectorAll(".course-card").forEach(card=>{
    card.addEventListener("click",()=>{
      const c = allCourses.find(x=>String(x.id)===String(card.dataset.id));
      if(c) window.location.href = `course.html?course=${encodeURIComponent(c.slug)}`;
    });
  });
}

function renderActiveFilters(){
  const filters = [];
  const q = searchInput.value.trim();
  const cat = $("#categoryFilter").value;
  const creator = $("#creatorFilter").value;
  const level = $("#levelFilter").value;
  const price = $("#priceFilter").value;

  if(q) filters.push(`Search: ${q}`);
  if(cat !== "All") filters.push(cat);
  if(creator !== "All") filters.push(creator);
  if(level !== "All") filters.push(level);
  if(price !== "All") filters.push(price.replace("0-499","Under ₹500").replace("500-699","₹500–₹699").replace("700+","₹700+"));
  if(activeCollection !== "All") filters.push(activeCollection.replace("BestSeller","Best Seller").replace("Recent","Recently Added"));

  $("#activeFilters").innerHTML = filters.map(f=>`<span>${f}</span>`).join("");
}

function applyFilters(){
  renderCourses(getFilteredCourses());
  renderActiveFilters();
}

function resetSelects(resetSearch=true){
  $("#categoryFilter").value = "All";
  $("#creatorFilter").value = "All";
  $("#levelFilter").value = "All";
  $("#priceFilter").value = "All";
  $("#sortFilter").value = "recommended";
  activeCategory = "All";
  activeCollection = "All";
  document.querySelectorAll("#collectionFilters button").forEach((b,i)=>b.classList.toggle("active", i===0));
  if(resetSearch) searchInput.value = "";
}

["#categoryFilter","#creatorFilter","#levelFilter","#priceFilter","#sortFilter"].forEach(sel=>{
  $(sel).addEventListener("change",()=>{
    if(sel === "#categoryFilter") activeCategory = "All";
    applyFilters();
  });
});

searchInput.addEventListener("input",()=>{
  activeCategory = "All";
  applyFilters();
});

$("#resetFilters").addEventListener("click",()=>{
  resetSelects(true);
  clearFilter.classList.add("hidden");
  applyFilters();
});

clearFilter.addEventListener("click",()=>{
  resetSelects(true);
  clearFilter.classList.add("hidden");
  applyFilters();
});

document.querySelectorAll("[data-close-modal]").forEach(el=>el.addEventListener("click",()=>{}));
document.addEventListener("keydown",e=>{
  if((e.metaKey || e.ctrlKey) && e.key.toLowerCase()==="k"){
    e.preventDefault();
    searchInput.focus();
  }
});

$("#year").textContent = new Date().getFullYear();
init();

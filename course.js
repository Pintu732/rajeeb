
let SETTINGS = {};
let COURSES = [];
let currentCourse = null;

const $ = s => document.querySelector(s);

function getSlug(){
  const params = new URLSearchParams(window.location.search);
  return params.get("course") || params.get("slug") || "";
}

function telegramUrl(course=null){
  const username = (course?.telegramUsername || SETTINGS.telegramUsername || "").replace("@","");
  const message = course?.telegramMessage ||
    `Hi, I am interested in "${course?.title || "a SkillVault course"}" by ${course?.creator || ""}. Please share details.`;
  return `https://t.me/${username}?text=${encodeURIComponent(message)}`;
}

async function loadJSON(path){
  const res = await fetch(path,{cache:"no-store"});
  if(!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

function setMeta(course){
  const title = `${course.title} by ${course.creator} | SkillVault`;
  const desc = course.description.slice(0,155);
  document.title = title;
  document.querySelector('meta[name="description"]').setAttribute("content",desc);
  document.querySelector('meta[property="og:title"]').setAttribute("content",title);
  document.querySelector('meta[property="og:description"]').setAttribute("content",desc);
  document.querySelector('meta[property="og:image"]').setAttribute("content",course.image);

  const canonical = `${window.location.origin}${window.location.pathname}?course=${encodeURIComponent(course.slug)}`;
  document.querySelector('link[rel="canonical"]').setAttribute("href",canonical);

  const schema = {
    "@context":"https://schema.org",
    "@type":"Course",
    "name":course.title,
    "description":course.description,
    "provider":{
      "@type":"Organization",
      "name":SETTINGS.brandName || "SkillVault"
    }
  };
  $("#courseSchema").textContent = JSON.stringify(schema);
}

function renderCourse(course){
  currentCourse = course;
  setMeta(course);

  $("#courseImage").src = course.image;
  $("#courseImage").alt = course.title;
  $("#courseCategory").textContent = course.category;
  $("#courseBadge").textContent = course.badge || "Course";
  $("#courseTitle").textContent = course.title;
  $("#courseCreator").textContent = `by ${course.creator}`;
  $("#courseDescription").textContent = course.description;
  $("#courseOldPrice").textContent = course.oldPrice || "";
  $("#coursePrice").textContent = course.price;
  $("#courseTelegram").href = telegramUrl(course);
  $("#navTelegram").href = telegramUrl();
  $("#footerTelegram").href = telegramUrl();

  $("#overviewText").textContent = course.description;
  const bestFor = [
    `Learners interested in ${course.category}`,
    `People searching for ${course.creator} courses`,
    `Anyone looking to build practical ${course.category.toLowerCase()} skills`
  ];
  $("#bestForList").innerHTML = bestFor.map(x=>`<li>${x}</li>`).join("");
  $("#tagList").innerHTML = (course.tags || []).map(t=>`<span>${t}</span>`).join("");

  renderRelated(course);
}

function renderRelated(course){
  const related = COURSES
    .filter(c=>c.id !== course.id)
    .sort((a,b)=>{
      const ac = a.category === course.category ? 1 : 0;
      const bc = b.category === course.category ? 1 : 0;
      return bc-ac;
    })
    .slice(0,4);

  $("#relatedCourses").innerHTML = related.map(c=>`
    <article class="course-card" data-slug="${c.slug}">
      <img class="course-image" src="${c.image}" alt="${c.title}" loading="lazy">
      <div class="course-content">
        <div class="course-top">
          <span class="pill">${c.category}</span>
          ${c.badge ? `<span class="badge">${c.badge}</span>` : ""}
        </div>
        <h3>${c.title}</h3>
        <p class="creator">by ${c.creator}</p>
        <div class="price-row">
          ${c.oldPrice ? `<span class="old-price">${c.oldPrice}</span>` : ""}
          <span class="price">${c.price}</span>
        </div>
      </div>
    </article>
  `).join("");

  $("#relatedCourses").querySelectorAll(".course-card").forEach(card=>{
    card.addEventListener("click",()=>{
      window.location.href = `course.html?course=${encodeURIComponent(card.dataset.slug)}`;
    });
  });
}

async function init(){
  try{
    [SETTINGS,COURSES] = await Promise.all([
      loadJSON("data/settings.json"),
      loadJSON("data/courses.json")
    ]);

    const slug = getSlug();
    const course = COURSES.find(c=>c.slug===slug) || COURSES[0];
    if(!course) throw new Error("No courses available");
    renderCourse(course);
  }catch(err){
    console.error(err);
    $("#courseTitle").textContent = "Course not found";
    $("#courseDescription").textContent = "This course could not be loaded.";
  }
}

$("#shareCourse").addEventListener("click", async ()=>{
  const btn = $("#shareCourse");
  try{
    if(navigator.share){
      await navigator.share({
        title: currentCourse?.title || "SkillVault Course",
        text: currentCourse?.description || "",
        url: window.location.href
      });
    }else{
      await navigator.clipboard.writeText(window.location.href);
      const old = btn.textContent;
      btn.textContent = "Link copied ✓";
      btn.classList.add("share-success");
      setTimeout(()=>{btn.textContent=old;btn.classList.remove("share-success")},1500);
    }
  }catch(e){}
});

$("#year").textContent = new Date().getFullYear();
init();

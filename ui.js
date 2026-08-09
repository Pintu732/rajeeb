
document.documentElement.classList.add("js");

function setupReveal(){
  const els = document.querySelectorAll(".section, .search-panel, .hero-showcase, .brand-statement, .cta-strip, .trust-notice, .course-card, .category-card, .feature-card");
  els.forEach(el => el.classList.add("reveal"));
  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("reveal-visible");
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.08, rootMargin:"0px 0px -30px 0px"});
  els.forEach(el=>io.observe(el));
}

function setupPageLoader(){
  const loader = document.createElement("div");
  loader.id = "pageLoader";
  loader.className = "page-loader";
  loader.innerHTML = `
    <div class="loader-inner">
      <img src="assets/skillvault-logo.svg" alt="" />
      <div class="loader-bar"><span></span></div>
    </div>`;
  document.body.prepend(loader);
  window.addEventListener("load",()=>{
    requestAnimationFrame(()=>loader.classList.add("loader-done"));
    setTimeout(()=>loader.remove(),650);
  });
}

function setupMobileNav(){
  const navbar = document.querySelector(".navbar");
  const nav = document.querySelector(".nav-links");
  if(!navbar || !nav || document.querySelector(".mobile-menu-btn")) return;

  const btn = document.createElement("button");
  btn.className = "mobile-menu-btn";
  btn.setAttribute("aria-label","Open navigation");
  btn.setAttribute("aria-expanded","false");
  btn.innerHTML = `<span></span><span></span><span></span>`;
  navbar.insertBefore(btn, navbar.querySelector(".nav-cta"));

  const overlay = document.createElement("div");
  overlay.className = "mobile-nav-overlay";
  overlay.innerHTML = `<div class="mobile-nav-panel">
    <div class="mobile-nav-head">
      <div class="brand"><img src="assets/skillvault-logo.svg" class="brand-logo" alt=""><span>SkillVault</span></div>
      <button class="mobile-nav-close" aria-label="Close navigation">×</button>
    </div>
    <div class="mobile-nav-links"></div>
  </div>`;
  document.body.appendChild(overlay);

  const links = overlay.querySelector(".mobile-nav-links");
  nav.querySelectorAll("a").forEach(a=>{
    const clone = a.cloneNode(true);
    links.appendChild(clone);
  });

  function openMenu(){
    overlay.classList.add("open");
    document.body.classList.add("menu-open");
    btn.setAttribute("aria-expanded","true");
  }
  function closeMenu(){
    overlay.classList.remove("open");
    document.body.classList.remove("menu-open");
    btn.setAttribute("aria-expanded","false");
  }

  btn.addEventListener("click",openMenu);
  overlay.querySelector(".mobile-nav-close").addEventListener("click",closeMenu);
  overlay.addEventListener("click",e=>{ if(e.target===overlay) closeMenu(); });
  links.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMenu));
}

function setupBackToTop(){
  const b = document.createElement("button");
  b.className="back-top";
  b.setAttribute("aria-label","Back to top");
  b.innerHTML="↑";
  document.body.appendChild(b);
  window.addEventListener("scroll",()=>b.classList.toggle("show",window.scrollY>500),{passive:true});
  b.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
}

function setupMagnetic(){
  document.querySelectorAll(".btn-primary").forEach(btn=>{
    btn.addEventListener("mousemove",e=>{
      if(window.matchMedia("(pointer:coarse)").matches) return;
      const r=btn.getBoundingClientRect();
      const x=(e.clientX-r.left-r.width/2)*.08;
      const y=(e.clientY-r.top-r.height/2)*.08;
      btn.style.transform=`translate(${x}px,${y}px)`;
    });
    btn.addEventListener("mouseleave",()=>btn.style.transform="");
  });
}

function setupImageFallback(){
  document.querySelectorAll("img").forEach(img=>{
    img.addEventListener("error",()=>{
      if(img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied="1";
      img.style.background="#121612";
      img.style.objectFit="contain";
      img.style.padding="24px";
      img.src="assets/skillvault-logo.svg";
    });
  });
}

function setupFAQ(){
  document.querySelectorAll("details").forEach(d=>{
    d.addEventListener("toggle",()=>{
      if(d.open){
        document.querySelectorAll("details").forEach(x=>{if(x!==d)x.open=false});
      }
    });
  });
}

setupPageLoader();
document.addEventListener("DOMContentLoaded",()=>{
  setupReveal();
  setupMobileNav();
  setupBackToTop();
  setupMagnetic();
  setupImageFallback();
  setupFAQ();
});

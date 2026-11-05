/* Thunder Street Ministry — small enhancements. Every page works without this file. */
(function () {
  "use strict";

  /* ---------- Case tabs: Overview / Case photos / Research ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute("aria-controls")); });

    function select(index, opts) {
      opts = opts || {};
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
        if (on && opts.animate) {
          panels[i].classList.remove("is-entering");
          void panels[i].offsetWidth;
          panels[i].classList.add("is-entering");
        }
      });
      if (opts.focus) tabs[index].focus();
      if (opts.updateHash && history.replaceState) {
        history.replaceState(null, "", "#" + panels[index].id);
      }
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(i, { animate: true, updateHash: true }); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = tabs.length - 1;
        if (next !== null) { e.preventDefault(); select(next, { focus: true, animate: true, updateHash: true }); }
      });
    });

    function fromHash() {
      var id = location.hash.replace("#", "");
      var idx = panels.findIndex(function (p) { return p.id === id; });
      select(idx >= 0 ? idx : 0);
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
  });

  /* ---------- Sensitive photos: blurred until the viewer chooses ---------- */
  document.querySelectorAll(".sensitive-reveal").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".gallery-item");
      item.classList.remove("is-sensitive");
      var open = item.querySelector(".gallery-open");
      if (open) open.focus();
    });
  });

  /* ---------- Photo lightbox ---------- */
  var dialog = document.querySelector(".lightbox");
  if (dialog && typeof dialog.showModal === "function") {
    var img = dialog.querySelector("img");
    var cap = dialog.querySelector("figcaption");
    var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-open"));
    var nav = dialog.querySelector(".lightbox-nav");
    var currentItem = null;

    // Only photos the viewer can see (sensitive ones they have not revealed are skipped)
    function viewable() { return items.filter(function (b) { return !b.closest(".is-sensitive"); }); }

    function show(item) {
      currentItem = item;
      img.src = item.dataset.full;
      img.alt = item.dataset.caption || "";
      cap.textContent = item.dataset.caption || "";
      nav.hidden = viewable().length < 2;
    }
    function step(delta) {
      var list = viewable();
      var i = list.indexOf(currentItem);
      if (i < 0 || list.length < 2) return;
      show(list[(i + delta + list.length) % list.length]);
    }

    items.forEach(function (btn) {
      btn.addEventListener("click", function () { show(btn); dialog.showModal(); });
    });
    dialog.querySelectorAll("[data-step]").forEach(function (b) {
      b.addEventListener("click", function () { step(Number(b.dataset.step)); });
    });
    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
  }

  /* ---------- Cases filter ---------- */
  document.querySelectorAll("[data-filter]").forEach(function (group) {
    var buttons = group.querySelectorAll("button");
    var cards = document.querySelectorAll(".case-card");
    var empty = document.querySelector("[data-empty]");

    // Hide filter options that have no cases yet
    buttons.forEach(function (b) {
      var v = b.dataset.value;
      if (v !== "all" && !document.querySelector('.case-card[data-status="' + v + '"]')) b.hidden = true;
    });

    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        var v = b.dataset.value, shown = 0;
        buttons.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        var apply = function () {
          cards.forEach(function (c) {
            var on = v === "all" || c.dataset.status === v;
            c.hidden = !on;
            if (on) shown++;
          });
          if (empty) empty.hidden = shown > 0;
        };
        if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
          document.startViewTransition(apply);
        } else { apply(); }
      });
    });
  });

  /* ---------- Contact form (pop-up) ---------- */
  var contact = document.getElementById("contact");
  if (contact && typeof contact.showModal === "function") {
    var form = contact.querySelector(".contact-form");
    var done = contact.querySelector(".contact-done");
    var doneTitle = contact.querySelector(".done-title");
    var doneText = contact.querySelector(".done-text");
    var status = form.querySelector(".form-status");
    var submit = form.querySelector('[type="submit"]');
    var endpoint = (form.dataset.endpoint || "").trim();
    var inbox = form.dataset.email;
    var required = ["contact-name", "contact-email", "contact-message"];

    function resetForm() {
      form.reset();
      form.hidden = false;
      done.hidden = true;
      status.textContent = "";
      required.forEach(function (id) { setError(id, false); });
    }

    function setError(id, on) {
      var input = document.getElementById(id);
      var msg = document.getElementById(id + "-error");
      input.setAttribute("aria-invalid", on ? "true" : "false");
      if (on) input.setAttribute("aria-describedby", id + "-error");
      else input.removeAttribute("aria-describedby");
      if (msg) msg.hidden = !on;
    }

    function validate() {
      var first = null;
      required.forEach(function (id) {
        var input = document.getElementById(id);
        var ok = input.value.trim() !== "" && input.checkValidity();
        setError(id, !ok);
        if (!ok && !first) first = input;
      });
      if (first) first.focus();
      return !first;
    }

    function showDone(title, text) {
      form.hidden = true;
      done.hidden = false;
      doneTitle.textContent = title;
      doneText.textContent = text;
      done.focus();
    }

    document.querySelectorAll("[data-contact-open]").forEach(function (opener) {
      opener.addEventListener("click", function (e) {
        e.preventDefault();
        if (!done.hidden) resetForm();
        var topic = opener.dataset.contactTopic;
        if (topic) { var box = document.getElementById(topic); if (box) box.checked = true; }
        contact.showModal();
        document.getElementById("contact-name").focus();
      });
    });
    contact.querySelectorAll("[data-contact-close]").forEach(function (b) {
      b.addEventListener("click", function () { contact.close(); });
    });
    contact.addEventListener("click", function (e) { if (e.target === contact) contact.close(); });
    required.forEach(function (id) {
      document.getElementById(id).addEventListener("input", function () {
        if (this.getAttribute("aria-invalid") === "true" && this.value.trim() && this.checkValidity()) setError(id, false);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.textContent = "";
      if (!validate()) return;
      if (form.elements._gotcha.value) return; // spam trap

      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var phone = form.elements.phone.value.trim();
      var message = form.elements.message.value.trim();
      var topics = Array.prototype.slice.call(form.querySelectorAll('[name="help_with"]:checked'))
        .map(function (c) { return c.value; });
      var subject = "Website message from " + name + (topics.length ? " (" + topics.join(", ") + ")" : "");

      if (!endpoint) {
        // No form service connected yet: hand the message to the visitor's email app
        var body = "Name: " + name + "\nEmail: " + email + (phone ? "\nPhone: " + phone : "") +
          "\nHow can we help: " + (topics.length ? topics.join(", ") : "Not specified") + "\n\n" + message;
        window.location.href = "mailto:" + inbox + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        showDone("Finish sending in your email app",
          "Your email app should open with your message ready to send. If it doesn't, write to us at " + inbox + ".");
        return;
      }

      var data = new FormData();
      data.append("name", name);
      data.append("email", email);
      data.append("phone", phone || "Not given");
      data.append("help_with", topics.length ? topics.join(", ") : "Not specified");
      data.append("message", message);
      data.append("_subject", subject);

      submit.disabled = true;
      submit.textContent = "Sending…";
      fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error("bad status");
          showDone("Message sent", "Thank you, " + name + ". We'll reply to " + email + " as soon as we can.");
        })
        .catch(function () {
          status.textContent = "Your message didn't send. Check your connection and try again, or write to us at " + inbox + ".";
        })
        .finally(function () {
          submit.disabled = false;
          submit.textContent = "Send message";
        });
    });
  }

  /* ---------- About: highlight the section in view ---------- */
  var rail = document.querySelector(".about-rail");
  if (rail && "IntersectionObserver" in window) {
    var links = rail.querySelectorAll("a");
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.remove("is-active"); a.removeAttribute("aria-current"); });
          var a = map[en.target.id];
          if (a) { a.classList.add("is-active"); a.setAttribute("aria-current", "true"); }
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });

    // Progress line for browsers without scroll-driven animations
    if (!(window.CSS && CSS.supports("animation-timeline: scroll()"))) {
      var fill = rail.querySelector(".rail-fill");
      var update = function () {
        var max = document.documentElement.scrollHeight - innerHeight;
        fill.style.setProperty("--progress", max > 0 ? Math.min(1, scrollY / max) : 0);
      };
      addEventListener("scroll", update, { passive: true });
      update();
    }
  }
})();

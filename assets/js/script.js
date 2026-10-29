/* ===== BUSINESS CONFIGURATION — edit these values only ===== */
const CONFIG = {
	phone: "+639198007351",
	whatsapp: "639774774656",
	facebookUrl: "https://www.facebook.com/snipertubelessvulcanizing/",
	messengerUrl: "https://m.me/994175307404470",
	address: "Toting Reyes Street, Kalibo, Aklan",
	mapsUrl: "https://maps.app.goo.gl/EFne8Q2azA2ZavNx9"
};

$(function() {

	const $nav = $('#navbar'),
		$menu = $('#mobile-menu'),
		$toggle = $('#menu-toggle');
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const msgUrl = CONFIG.messengerUrl || CONFIG.facebookUrl;
	const waOn = /^\d{8,15}$/.test(CONFIG.whatsapp);
	const telOn = /^\+?[\d\s-]{7,}$/.test(CONFIG.phone);
	const telHref = 'tel:' + CONFIG.phone.replace(/[^\d+]/g, '');

	$('#year').text(new Date().getFullYear());

	/* contact config: unconfigured items stay hidden */
	const show = ($el, href) => {
		if (href) $el.attr('href', href).prop('hidden', false);
	};
	if (telOn) {
		show($('[data-action=call]'), telHref);
		$('#phone-text').text(CONFIG.phone);
		$('[data-show=phone]').prop('hidden', false);
	}
	show($('[data-action=message]'), msgUrl);
	show($('[data-action=facebook]'), CONFIG.facebookUrl);
	show($('[data-action=directions]'), CONFIG.mapsUrl);
	if (CONFIG.address) {
		$('#address-text').text(CONFIG.address);
		$('[data-show=address]').prop('hidden', false);
	}
	if (!(telOn || msgUrl || CONFIG.mapsUrl)) $('#config-note').prop('hidden', false);
	const floatHref = telOn ? telHref : (waOn ? 'https://wa.me/' + CONFIG.whatsapp : msgUrl);
	if (floatHref) {
		$('#float-cta').attr('href', floatHref).prop('hidden', false);
		if (!telOn) $('#float-cta').attr({
			target: '_blank',
			rel: 'noopener'
		});
		$('body').addClass('has-float');
	}

	/* navigation */
	const closeMenu = () => {
		$menu.addClass('hidden');
		$toggle.attr('aria-expanded', 'false').find('i').attr('class', 'fa-solid fa-bars text-xl');
	};
	$toggle.on('click', function() {
		const open = $menu.hasClass('hidden');
		$menu.toggleClass('hidden', !open);
		$(this).attr('aria-expanded', open).find('i').attr('class', open ? 'fa-solid fa-xmark text-xl' : 'fa-solid fa-bars text-xl');
	});
	$('a[href^="#"]').on('click', function(e) {
		const id = this.getAttribute('href');
		if (id.length < 2 || !$(id).length) return;
		e.preventDefault();
		closeMenu();
		$(id)[0].scrollIntoView({
			behavior: reduce ? 'auto' : 'smooth'
		});
		history.replaceState(null, '', id);
	});
	$(document).on('keydown', e => {
		if (e.key === 'Escape') closeMenu();
	});

	/* scroll state (single throttled handler) */
	const sections = $('main section[id]').toArray();
	let ticking = false;
	const onScroll = () => {
		const y = window.scrollY;
		$nav.toggleClass('scrolled', y > 10);
		$('#to-top').toggleClass('show', y > 600);
		let cur = sections[0].id;
		sections.forEach(s => {
			if (s.offsetTop - 120 <= y) cur = s.id;
		});
		if (cur === 'how') cur = 'services';
		$('.nav-link').each(function() {
			$(this).toggleClass('active', this.getAttribute('href') === '#' + cur);
		});
		ticking = false;
	};
	$(window).on('scroll', () => {
		if (!ticking) {
			ticking = true;
			requestAnimationFrame(onScroll);
		}
	});
	onScroll();
	$('#to-top').on('click', () => window.scrollTo({
		top: 0,
		behavior: reduce ? 'auto' : 'smooth'
	}));

	/* reveal on scroll */
	if ('IntersectionObserver' in window && !reduce) {
		const io = new IntersectionObserver(es => es.forEach(en => {
			if (en.isIntersecting) {
				en.target.classList.add('in');
				io.unobserve(en.target);
			}
		}), {
			threshold: .12
		});
		$('.reveal').each((_, el) => io.observe(el));
	} else $('.reveal').addClass('in');

	/* service buttons preselect the form */
	$('.inquire').on('click', function() {
		$('#f-service').val($(this).data('service'));
	});

	/* inquiry form -> prefilled WhatsApp message */
	const $form = $('#inquiry-form'),
		$status = $('#form-status'),
		$btn = $('#form-submit');
	const rules = {
		name: v => v.trim().length >= 2 || 'Enter your full name.',
		mobile: v => /^(\+?63|0)9\d{9}$/.test(v.replace(/[\s-]/g, '')) || 'Enter a valid Philippine mobile number, like 09171234567.',
		service: v => !!v || 'Select the service you need.',
		location: v => v.trim().length >= 3 || 'Tell us where you are.',
		message: v => v.trim().length >= 5 || 'Describe your tire problem briefly.'
	};

	function check(name) {
		const $f = $form.find('[name=' + name + ']'),
			r = rules[name]($f.val()),
			ok = r === true;
		$f.attr('aria-invalid', !ok);
		$('#e-' + name).text(ok ? '' : r);
		return ok;
	}
	$form.find('.fld').on('blur input change', function() {
		if ($(this).attr('aria-invalid')) check(this.name);
	});
	const noWa = 'WhatsApp is not set up yet. Please use the call or message buttons above.';
	if (!waOn) $status.text(noWa);
	$form.on('submit', function(e) {
		e.preventDefault();
		if ($btn.prop('disabled')) return;
		const bad = Object.keys(rules).filter(n => !check(n));
		if (bad.length) {
			$form.find('[name=' + bad[0] + ']').trigger('focus');
			$status.addClass('text-race').text('Please fix the highlighted fields.');
			return;
		}
		if (!waOn) {
			$status.addClass('text-race').text(noWa);
			return;
		}
		const v = n => $form.find('[name=' + n + ']').val().trim();
		const text = `Hello Sniper Tubeless Vulcanizing Shop,\n\nName: ${v('name')}\nMobile: ${v('mobile')}\nService: ${v('service')}\nLocation: ${v('location')}\nProblem: ${v('message')}`;
		$btn.prop('disabled', true);
		window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
		$status.removeClass('text-race').text('WhatsApp opened with your message. Press send there to contact the shop.');
		setTimeout(() => $btn.prop('disabled', false), 4000);
	});
});

/* ===== BRANDS (source: shop price list; names only, no prices) =====
   To show an official logo, drop the file in assets/images/brands/ and set logo: "filename.png".
   Without a logo file the brand name is shown in clean type. */
const CAT = {
	moto: 'Motorcycle Tires',
	car: 'Car Tires',
	tube: 'Interior Tubes',
	other: 'Other Products and Accessories'
};
const BRANDS = [{
		name: 'Maxxis',
		categories: [CAT.moto],
		logo: 'maxxis.png',
		about: 'Maxxis offers high-performance tires for passenger cars, SUVs, light trucks, motorcycles, and bicycles'
	},
	{
		name: 'CST',
		categories: [CAT.moto],
		logo: 'cst_orange.png'
	},
	{
		name: 'Chaoyang',
		categories: [CAT.moto],
		logo: 'chaoyang.png'
	},
	{
		name: 'Westlake',
		categories: [CAT.moto],
		logo: 'westlake.jpg'
	},
	{
		name: 'Leo',
		categories: [CAT.moto, CAT.tube],
		logo: 'leo.png'
	},
	{
		name: 'Sapphire',
		categories: [CAT.moto, CAT.tube],
		logo: 'sapphire.png'
	},
	{
		name: 'Deestone',
		categories: [CAT.moto, CAT.tube],
		logo: 'deestone.webp'
	},
	{
		name: 'Trazano',
		categories: [CAT.moto],
		logo: 'trazano.png'
	},
	{
		name: 'Powertire',
		categories: [CAT.moto],
		logo: 'powertire.png'
	},
	{
		name: 'Camel',
		categories: [CAT.moto],
		logo: 'camel.jpg'
	},
	{
		name: 'Kryon',
		categories: [CAT.moto],
		logo: 'kryon.jpg'
	},
	{
		name: 'Izumi',
		categories: [CAT.moto],
		logo: ''
	},
	{
		name: 'CEAT',
		categories: [CAT.moto],
		logo: ''
	},
	{
		name: 'MRF',
		categories: [CAT.moto],
		logo: 'mrf.png'
	},
	{
		name: 'Moto Xtreme',
		categories: [CAT.moto],
		logo: ''
	},
	{
		name: 'Izuki',
		categories: [CAT.moto],
		logo: ''
	},
	{
		name: 'Kaizen',
		categories: [CAT.moto],
		logo: ''
	},
	{
		name: 'Sony Economy',
		categories: [CAT.moto],
		logo: ''
	},
	{
		name: 'Black Hawk',
		categories: [CAT.car],
		logo: 'blackhawk.png',
		about: 'Blackhawk prides itself on offering high-quality tires that bring premium performance to everyday drivers. We apply the next generation equipment and cutting-edge technology on our tires.'
	},
	{
		name: 'A Plus',
		categories: [CAT.car],
		logo: 'aplus.jpg',
		about: 'APLUS is an all-round tyre brand that combines reliable quality with balanced performance. Designed for European roads and a wide range of driving conditions, APLUS tyres deliver safe, stable, and comfortable driving. With safety at the core of every design, each tyre offers excellent wet grip, low noise, lasting durability, ride comfort, stability, and improved energy efficiency.'
	},
	{
		name: 'Mirage',
		categories: [CAT.car],
		logo: ''
	},
	{
		name: 'Compasal',
		categories: [CAT.car],
		logo: 'compasal.jpg'
	},
	{
		name: 'Onyx',
		categories: [CAT.car],
		logo: ''
	},
	{
		name: 'Phely',
		categories: [CAT.car],
		logo: ''
	},
	{
		name: 'Roadwing',
		categories: [CAT.car],
		logo: ''
	},
	{
		name: 'Tracross',
		categories: [CAT.car],
		logo: ''
	},
	{
		name: 'Goodride',
		categories: [CAT.car],
		logo: 'goodride.jpg'
	},
	{
		name: 'Marris',
		categories: [CAT.car],
		logo: 'marris.jpg'
	},
	{
		name: 'Balado',
		categories: [CAT.car],
		logo: 'balado.jpg'
	},
	{
		name: 'Double Camel',
		categories: [CAT.car],
		logo: ''
	},
	{
		name: 'Macroad',
		categories: [CAT.car],
		logo: ''
	},
	{
		name: 'Multicab Tube',
		categories: [CAT.tube],
		logo: ''
	},
	{
		name: 'Taitec',
		categories: [CAT.other],
		logo: 'taitec.jpg'
	},
	{
		name: 'Atlantic',
		categories: [CAT.other],
		logo: 'atlantic.webp'
	},
	{
		name: 'Volga',
		categories: [CAT.other],
		logo: 'volga.webp'
	},
	{
		name: 'Richstar',
		categories: [CAT.other],
		logo: 'richstar.png'
	},
	{
		name: 'WD-40',
		categories: [CAT.other],
		logo: 'WD-40.png'
	},
	{
		name: 'Koby',
		categories: [CAT.other],
		logo: 'koby.png'
	},
	{
		name: 'Bushi-R',
		categories: [CAT.other],
		logo: ''
	},
	{
		name: 'TOP 1 Hi-Temp Synthetic Grease',
		categories: [CAT.other],
		logo: 'top1.webp',
		about: 'TOP 1 Multi-Purpose high temp grease is a SYNTHETIC BLEND GREASE. It is a premium lithium complex formula. It delivers superior protection and reliable lubrication for equipment across automotive, agriculture, marine, construction, and mining applications. Applications include automotive wheel bearings, automotive chassis, conveyor bearings, backhoe hinge pins, and bearings subject to shock loads.'
	},
	{
		name: 'Tire Flaps',
		categories: [CAT.other],
		logo: ''
	},
	{
		name: 'Rubber / Stainless Valve',
		categories: [CAT.other],
		logo: ''
	},
];

$(function() {
	const car = document.getElementById('brand-carousel');
	if (!car) return;
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const hoverOk = window.matchMedia('(hover: hover)').matches;
	const waOn = /^\d{8,15}$/.test(CONFIG.whatsapp);
	const esc = s => s.replace(/[&<>"]/g, c => ({
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;'
	} [c]));
	window.brandFallback = img => {
		const s = document.createElement('span');
		s.className = 'brand-name';
		s.textContent = img.alt.replace(/ logo$/, '');
		img.replaceWith(s);
	};
	const card = (i, clone) => {
		const b = BRANDS[i];
		const inner = b.logo ? `<img class="brand-logo" src="assets/images/brands/${esc(b.logo)}" alt="${esc(b.name)} logo" loading="lazy" onerror="brandFallback(this)">` : `<span class="brand-name">${esc(b.name)}</span>`;
		return `<button type="button" class="brand-card" data-i="${i}" aria-label="${esc(b.name)}, view details"${clone ? ' aria-hidden="true" tabindex="-1"' : ''}>${inner}</button>`;
	};

	/* filters */
	const filters = [
		['all', 'All brands']
	].concat(Object.values(CAT).map(c => [c, c]));
	$('#brand-filters').html(filters.map(([v, l], k) => `<button type="button" class="chip" data-cat="${esc(v)}" aria-pressed="${k === 0}">${esc(l)}</button>`).join(''));

	/* seamless track: [real][copy][copy], start on the middle copy */
	let set = 0,
		pos = 0,
		cat = 'all',
		lastW = 0;

	function render() {
		const idx = BRANDS.map((_, i) => i).filter(i => cat === 'all' || BRANDS[i].categories.includes(cat));
		car.innerHTML = '<div class="brand-track"></div>';
		const tr = car.firstChild;
		tr.innerHTML = idx.map(i => card(i)).join('');
		const reps = Math.max(1, Math.ceil(car.clientWidth / (tr.scrollWidth || 1)));
		const real = idx.map(i => card(i)).join('').repeat(reps),
			dup = idx.map(i => card(i, true)).join('').repeat(reps);
		tr.innerHTML = real + dup + dup;
		set = tr.scrollWidth / 3;
		pos = set;
		car.scrollLeft = set;
		lastW = car.clientWidth;
	}
	render();
	$('#brand-filters').on('click', '.chip', function() {
		$('#brand-filters .chip').attr('aria-pressed', 'false');
		$(this).attr('aria-pressed', 'true');
		cat = String($(this).data('cat'));
		render();
	});
	let rt;
	$(window).on('resize', () => {
		clearTimeout(rt);
		rt = setTimeout(() => {
			if (car.clientWidth !== lastW) render();
		}, 250);
	});
	car.addEventListener('scroll', () => {
		const l = car.scrollLeft;
		if (l >= 2 * set) car.scrollLeft = l - set;
		else if (l <= 0) car.scrollLeft = l + set;
	}, {
		passive: true
	});

	/* auto-scroll right to left; paused on hover, touch, keyboard focus, modal, or off-screen */
	let paused = false,
		modalOpen = false,
		visible = false,
		raf = 0,
		last = 0,
		resumeT;
	const setPause = p => {
		if (!p) {
			if (modalOpen) return;
			pos = car.scrollLeft;
		}
		paused = p;
	};

	function tick(t) {
		raf = 0;
		if (!visible || reduce) return;
		const dt = Math.min(t - last, 50);
		last = t;
		if (!paused && set) {
			pos += 0.045 * dt;
			if (pos >= 2 * set) pos -= set;
			car.scrollLeft = pos;
		}
		raf = requestAnimationFrame(tick);
	}
	const start = () => {
		if (!raf && visible && !reduce) {
			last = performance.now();
			raf = requestAnimationFrame(tick);
		}
	};
	if ('IntersectionObserver' in window) new IntersectionObserver(es => {
		visible = es[0].isIntersecting;
		start();
	}).observe(car);
	if (hoverOk) {
		car.addEventListener('mouseenter', () => setPause(true));
		car.addEventListener('mouseleave', () => setPause(false));
	}
	car.addEventListener('touchstart', () => {
		clearTimeout(resumeT);
		setPause(true);
	}, {
		passive: true
	});
	car.addEventListener('touchend', () => {
		resumeT = setTimeout(() => setPause(false), 2500);
	}, {
		passive: true
	});
	car.addEventListener('focusin', e => {
		try {
			if (e.target.matches(':focus-visible')) setPause(true);
		} catch (_) {}
	});
	car.addEventListener('focusout', () => setPause(false));

	/* brand modal */
	const $m = $('#brand-modal');
	let opener = null,
		msg = '';

	function openModal(i, el) {
		const b = BRANDS[i];
		opener = el;
		msg = `Hello, Sniper Tubeless Vulcanizing Shop! I would like to inquire about products from ${b.name}. Thank you!`;
		$('#bm-name').text(b.name);
		$('#bm-cats').text(b.categories.join(', '));
		$("#bm-about").text(b.about);
		const $cta = $('#bm-cta');
		if (waOn) $cta.attr({
			href: 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg),
			target: '_blank',
			rel: 'noopener'
		});
		else $cta.attr('href', '#contact').removeAttr('target rel');
		modalOpen = true;
		paused = true;
		$m.removeClass('hidden').addClass('flex');
		$('body').addClass('lock');
		$('#bm-close').trigger('focus');
	}

	function closeModal(restore) {
		$m.addClass('hidden').removeClass('flex');
		$('body').removeClass('lock');
		modalOpen = false;
		setPause(false);
		if (restore && opener) opener.focus();
	}
	$(car).on('click', '.brand-card', function() {
		openModal(+this.dataset.i, this);
	});
	$('#bm-close').on('click', () => closeModal(true));
	$m.on('click', e => {
		if (e.target === $m[0]) closeModal(true);
	});
	$('#bm-cta').on('click', () => {
		if (!waOn) {
			$('#f-service').val('Other Inquiry');
			$('#f-message').val(msg);
		}
		closeModal(false);
	});
	$(document).on('keydown', e => {
		if (e.key === 'Escape' && modalOpen) closeModal(true);
	});
	$m.on('keydown', e => {
		if (e.key !== 'Tab') return;
		const f = $('#bm-close, #bm-cta').toArray(),
			i = f.indexOf(document.activeElement);
		e.preventDefault();
		f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
	});
});
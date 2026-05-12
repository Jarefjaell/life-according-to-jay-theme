// Mobile navigation toggle
(function () {
    var toggle = document.querySelector('.nav-mobile-toggle');
    var links = document.querySelector('.nav-links');

    if (toggle && links) {
        toggle.addEventListener('click', function () {
            links.classList.toggle('open');
        });

        links.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                links.classList.remove('open');
            });
        });
    }
})();

// Copy link button
(function () {
    var btn = document.getElementById('share-copy');
    if (!btn) return;

    btn.addEventListener('click', function () {
        var url = btn.getAttribute('data-url');
        navigator.clipboard.writeText(url).then(function () {
            var label = btn.querySelector('.share-btn-label');
            var original = label.textContent;
            label.textContent = 'Copied';
            btn.classList.add('copied');
            setTimeout(function () {
                label.textContent = original;
                btn.classList.remove('copied');
            }, 2000);
        }).catch(function () {
            var label = btn.querySelector('.share-btn-label');
            var original = label.textContent;
            label.textContent = 'Failed';
            setTimeout(function () {
                label.textContent = original;
            }, 2000);
        });
    });
})();

// LinkedIn conversation link
// To set the LinkedIn post URL for an article:
// 1. Open the post in Ghost editor
// 2. Click settings cog > Code injection
// 3. In the Post Header field, paste:
//    <meta name="linkedin-post" content="YOUR_LINKEDIN_POST_URL">
(function () {
    var meta = document.querySelector('meta[name="linkedin-post"]');
    var link = document.getElementById('linkedin-link');
    if (meta && link) {
        var url = meta.getAttribute('content');
        if (url && url.indexOf('linkedin.com') !== -1) {
            link.href = url;
        }
    }
})();

// Writing archive filter
(function () {
    var filterBar = document.getElementById('filter-bar');
    var list = document.getElementById('writing-list');
    if (!filterBar || !list) return;

    var items = list.querySelectorAll('.article-item');
    var tags = {};

    items.forEach(function (item) {
        var itemTags = (item.getAttribute('data-tags') || '').trim().split(/\s+/);
        itemTags.forEach(function (slug) {
            if (!slug || slug.startsWith('hash-')) return;
            tags[slug] = true;
        });
    });

    var tagNames = {
        'ai': 'AI',
        'work-systems': 'Work & Systems',
        'culture-society': 'Culture & Society',
        'identity-change': 'Identity & Change',
        'modern-life': 'Modern Life'
    };

    Object.keys(tags).sort().forEach(function (slug) {
        var btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.setAttribute('data-filter', slug);
        btn.textContent = tagNames[slug] || slug;
        filterBar.appendChild(btn);
    });

    filterBar.addEventListener('click', function (e) {
        if (!e.target.classList.contains('filter-btn')) return;

        var filter = e.target.getAttribute('data-filter');

        filterBar.querySelectorAll('.filter-btn').forEach(function (btn) {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        var visibleCount = 0;
        items.forEach(function (item) {
            var itemTags = (item.getAttribute('data-tags') || '').trim().split(/\s+/);
            if (filter === 'all' || itemTags.indexOf(filter) !== -1) {
                item.classList.remove('hidden');
                visibleCount++;
            } else {
                item.classList.add('hidden');
            }
        });

        var existing = list.querySelector('.no-results');
        if (existing) existing.remove();

        if (visibleCount === 0) {
            var msg = document.createElement('p');
            msg.className = 'no-results';
            msg.textContent = 'No writing in this category yet.';
            list.appendChild(msg);
        }
    });
})();

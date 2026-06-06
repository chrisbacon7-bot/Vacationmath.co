/* =====================================================================
   Live Quote Handoff
   Renders a "Get a live quote" block at the end of each calc result.
   Each partner link is structured so you can swap in your affiliate
   tracking parameter in one place (AFFILIATE_TAGS below).

   Usage: VM_LiveQuote.render({ container, calc, selection })
     calc       = "disney" | "themeparks" | "cruise" | "allinclusive"
                  | "whentobook" | "roadtrip" | "points" | "timeshare"
     selection  = { parkId?, lineId?, destinationId?, originId?,
                    developerId?, programId?, route?, week? }
   ===================================================================== */
(function (global) {
  "use strict";

  // ---- Affiliate tracking — fill these in when programs go live ----
  // Until then, links are clean and the disclosure says "we may earn".
  var AFFILIATE_TAGS = {
    expedia: "",          // e.g. "?camref=YOUR_ID"
    booking: "",          // e.g. "?aid=YOUR_ID"
    hotels: "",
    kayak: "",
    cruisedirect: "",
    cruisecritic: "",
    awin: ""              // generic Awin / CJ wrapper
  };

  function tag(provider) {
    return AFFILIATE_TAGS[provider] || "";
  }

  // ---- Partner deep links ----
  // Each calc maps to 1-3 partner cards. Each card has: name, label, url, why.
  // URL functions receive `selection` so we can deep-link by destination/brand.

  var PARTNERS = {
    disney: function (sel) {
      return [
        {
          name: "Disney World official",
          label: "Build a quote on disneyworld.com",
          why: "Live room + ticket pricing for your exact dates.",
          url: "https://disneyworld.disney.go.com/special-offers/"
        },
        {
          name: "Costco Travel",
          label: "Costco Disney packages",
          why: "Often beats Disney direct on bundled packages + adds a gift card.",
          url: "https://www.costcotravel.com/Vacation-Packages/Walt-Disney-World-Resort"
        },
        {
          name: "Undercover Tourist",
          label: "Discounted multi-day tickets",
          why: "Authorized reseller, typically $30-80 off multi-day Disney tickets.",
          url: "https://www.undercovertourist.com/orlando/walt-disney-world/" + tag("awin")
        }
      ];
    },

    themeparks: function (sel) {
      var parkId = (sel && sel.parkId) || "disney_wdw";
      var parkLinks = {
        disney_wdw: "https://disneyworld.disney.go.com/special-offers/",
        disneyland: "https://disneyland.disney.go.com/offers/",
        universal_orlando: "https://www.universalorlando.com/web/en/us/tickets-packages/theme-park-tickets",
        universal_hollywood: "https://www.universalstudioshollywood.com/web/en/us/tickets",
        seaworld_orlando: "https://seaworld.com/orlando/tickets/",
        busch_gardens_tampa: "https://buschgardens.com/tampa/tickets/",
        busch_gardens_williamsburg: "https://buschgardens.com/williamsburg/tickets/",
        six_flags_magic_mountain: "https://www.sixflags.com/magicmountain/store/tickets",
        six_flags_great_adventure: "https://www.sixflags.com/greatadventure/store/tickets",
        cedar_point: "https://www.cedarpoint.com/tickets",
        kings_island: "https://www.visitkingsisland.com/tickets",
        hersheypark: "https://www.hersheypark.com/tickets-passes/",
        dollywood: "https://www.dollywood.com/themepark/tickets",
        knotts_berry_farm: "https://www.knotts.com/tickets",
        legoland_florida: "https://www.legoland.com/florida/tickets/",
        legoland_california: "https://www.legoland.com/california/tickets/",
        great_wolf_lodge: "https://www.greatwolf.com/",
        silver_dollar_city: "https://www.silverdollarcity.com/theme-park/tickets"
      };
      return [
        {
          name: "Official park site",
          label: "Live ticket pricing",
          why: "Most accurate pricing for your travel dates.",
          url: parkLinks[parkId] || parkLinks.disney_wdw
        },
        {
          name: "Undercover Tourist",
          label: "Discounted multi-day tickets",
          why: "Authorized reseller for Disney, Universal, SeaWorld, Busch.",
          url: "https://www.undercovertourist.com/" + tag("awin")
        }
      ];
    },

    cruise: function (sel) {
      var lineId = (sel && sel.lineId) || "";
      var lineLinks = {
        royal_caribbean: "https://www.royalcaribbean.com/cruises",
        carnival: "https://www.carnival.com/cruise-deals",
        ncl: "https://www.ncl.com/cruise-deals",
        msc: "https://www.msccruisesusa.com/manage-booking/special-offers",
        celebrity: "https://www.celebritycruises.com/cruise-deals",
        princess: "https://www.princess.com/cruise-deals-promotions/",
        disney: "https://disneycruise.disney.go.com/special-offers/",
        holland_america: "https://www.hollandamerica.com/en/us/find-a-cruise/cruise-deals",
        virgin_voyages: "https://www.virginvoyages.com/voyages",
        viking_ocean: "https://www.vikingcruises.com/oceans/cruise-destinations/",
        oceania: "https://www.oceaniacruises.com/special-offers",
        cunard: "https://www.cunard.com/en-us/cruise-deals",
        azamara: "https://www.azamara.com/cruise-deals",
        regent_seven_seas: "https://www.rssc.com/specials",
        silversea: "https://www.silversea.com/special-offers.html",
        costa: "https://www.costacruises.com/",
        margaritaville_at_sea: "https://www.margaritavilleatsea.com/"
      };
      return [
        {
          name: "Cruise line official",
          label: "Live cabin pricing",
          why: "Best price match if you find a cheaper rate elsewhere.",
          url: lineLinks[lineId] || lineLinks.royal_caribbean
        },
        {
          name: "CruiseDirect",
          label: "Compare 30+ lines",
          why: "Aggregator. Often $50-$200 below the line's published rate.",
          url: "https://www.cruisedirect.com/" + tag("cruisedirect")
        },
        {
          name: "Cruise Critic deals",
          label: "Member-only fares",
          why: "Verified deals + cabin reviews before you commit.",
          url: "https://www.cruisecritic.com/deals/" + tag("cruisecritic")
        }
      ];
    },

    allinclusive: function (sel) {
      var destId = (sel && sel.destinationId) || "";
      // Map destination ids to Apple Vacations / Expedia deeplinks
      // Generic Expedia search by destination keyword
      var query = encodeURIComponent((sel && sel.destinationLabel) || "Cancun");
      return [
        {
          name: "Apple Vacations",
          label: "All-inclusive packages",
          why: "Bundles flight + resort + transfer — usually beats booking each separately.",
          url: "https://www.applevacations.com/"
        },
        {
          name: "Expedia all-inclusive",
          label: "Live all-inc package pricing",
          why: "Filter by adults-only, kids' clubs, beachfront for your dates.",
          url: "https://www.expedia.com/Vacation-Packages?destination=" + query + tag("expedia")
        },
        {
          name: "Costco Travel",
          label: "Costco AI packages",
          why: "Frequently $200-500 below Expedia on the same property.",
          url: "https://www.costcotravel.com/Vacation-Packages"
        }
      ];
    },

    whentobook: function (sel) {
      var origin = encodeURIComponent((sel && sel.originLabel) || "");
      var dest = encodeURIComponent((sel && sel.destinationLabel) || "");
      return [
        {
          name: "Google Flights",
          label: "Set a fare alert",
          why: "Free price tracking — emails you when your route drops.",
          url: "https://www.google.com/travel/flights?q=Flights+from+" + origin + "+to+" + dest
        },
        {
          name: "Kayak",
          label: "Watch this route",
          why: "Price prediction tool tells you 'wait' or 'buy now'.",
          url: "https://www.kayak.com/flights" + tag("kayak")
        },
        {
          name: "Going (formerly Scott's Cheap Flights)",
          label: "Mistake-fare alerts",
          why: "Email service that catches airline pricing errors. Free + premium tiers.",
          url: "https://www.going.com/"
        }
      ];
    },

    roadtrip: function (sel) {
      return [
        {
          name: "GasBuddy",
          label: "Live gas prices on your route",
          why: "Map view of cheapest stations along the way.",
          url: "https://www.gasbuddy.com/"
        },
        {
          name: "Booking.com",
          label: "Hotels on your route",
          why: "Free cancellation rates so you can adjust as you drive.",
          url: "https://www.booking.com/" + tag("booking")
        },
        {
          name: "AAA Trip Planner",
          label: "Map + member rates",
          why: "Free with membership; bundles tow coverage + hotel discounts.",
          url: "https://www.aaa.com/triptik"
        }
      ];
    },

    points: function (sel) {
      var programId = (sel && sel.programId) || "";
      // Direct to the points program's award booking page
      var awardLinks = {
        chase_ur: "https://www.chase.com/personal/credit-cards/sapphire-preferred",
        amex_mr: "https://www.americanexpress.com/us/credit-cards/membership-rewards/",
        capone_miles: "https://www.capitalone.com/credit-cards/venture/",
        citi_typ: "https://www.citi.com/credit-cards/thankyou-rewards",
        united_my: "https://www.united.com/en/us/fly/mileageplus.html",
        aa_advantage: "https://www.aa.com/i18n/aadvantage-program/aadvantage-program.jsp",
        delta_sm: "https://www.delta.com/skymiles",
        marriott_bonvoy: "https://www.marriott.com/loyalty.mi",
        hilton_honors: "https://www.hilton.com/en/hilton-honors/",
        hyatt_wofh: "https://world.hyatt.com/content/gp/en/about.html"
      };
      return [
        {
          name: "Program award page",
          label: "Search award space",
          why: "Live availability on your dates — points pricing only.",
          url: awardLinks[programId] || "https://thepointsguy.com/guide/maximizing-points-and-miles/"
        },
        {
          name: "The Points Guy valuations",
          label: "Latest cpp data",
          why: "Third-party valuations updated monthly — sanity-check our cpp.",
          url: "https://thepointsguy.com/loyalty-programs/monthly-valuations/"
        }
      ];
    },

    timeshare: function (sel) {
      return [
        {
          name: "Timeshare Users Group (TUG)",
          label: "Resale marketplace",
          why: "Same brand, 70-90% off retail. Buyer-protected forum + classifieds.",
          url: "https://www.tugbbs.com/"
        },
        {
          name: "RedWeek",
          label: "Verified resale + rentals",
          why: "Lets you rent before you buy. Often the smarter math.",
          url: "https://www.redweek.com/"
        },
        {
          name: "Licensed Timeshare Resale Brokers Assoc.",
          label: "LTRBA member brokers",
          why: "Only NO upfront-fee, licensed resale brokers. Safer than direct purchase.",
          url: "https://www.ltrba.com/"
        }
      ];
    }
  };

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>\"']/g, function (c) {
      return ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" })[c];
    });
  }

  function render(opts) {
    opts = opts || {};
    var container = opts.container;
    var calc = opts.calc;
    var selection = opts.selection || {};
    if (!container || !PARTNERS[calc]) return;

    var partners = PARTNERS[calc](selection);
    if (!partners || !partners.length) return;

    var html = ''
      + '<section class="live-quote">'
      +   '<div class="live-quote-head">'
      +     '<p class="kicker">Get a live quote</p>'
      +     '<h3>Our number is the average. Yours is one click away.</h3>'
      +     '<p class="live-quote-sub">Live pricing changes daily. These partners pull real-time rates for your dates — start with one to sanity-check the math above.</p>'
      +   '</div>'
      +   '<div class="live-quote-grid">';

    partners.forEach(function (p) {
      html += ''
        + '<a class="live-quote-card" href="' + escapeHtml(p.url) + '" target="_blank" rel="noopener nofollow sponsored">'
        +   '<p class="lq-name">' + escapeHtml(p.name) + '</p>'
        +   '<p class="lq-label">' + escapeHtml(p.label) + ' &rarr;</p>'
        +   '<p class="lq-why">' + escapeHtml(p.why) + '</p>'
        + '</a>';
    });

    html += '</div>'
      +   '<p class="live-quote-disclosure">We may earn a commission on bookings made through these links, at no cost to you. We never promote a partner whose pricing we wouldn\'t personally use.</p>'
      + '</section>';

    container.innerHTML = html;
  }

  global.VM_LiveQuote = { render: render, PARTNERS: PARTNERS, AFFILIATE_TAGS: AFFILIATE_TAGS };
})(this);

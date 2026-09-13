"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Activity = {
  time: string;
  type: string;
  icon: string;
  text: string;
  destination: string;
  badge?: string;
  alert?: string;
  photo?: string;
  bookingKey?: string;
  optional?: boolean;
};

type Booking = {
  key: string;
  name: string;
  confirmation?: string;
  time?: string;
  meetingPoint?: string;
  notes?: string;
  link?: string;
};

type TripDay = {
  day: number;
  date: string;
  title: string;
  stay: string;
  drive: string;
  alerts: string[];
  map: string;
  activities: Activity[];
  bookings?: Booking[];
};

const TRIP_PASSWORD = "alaska2026";
const PASSWORD_STORAGE_KEY = "alaska-trip-access-granted";

function navLink(destination: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`;
}

const days: TripDay[] = [
  {
    day: 1,
    date: "Wed, Nov 26",
    title: "Arrival — Anchorage",
    stay: "Coast Inn, Anchorage (booked — Chaitra, Jose, Sathya)",
    drive: "ANC Airport → Coast Inn → Turnagain Arm → AWCC → Anchorage",
    alerts: ["AZ + SF land 1:40am", "SD arrivals TBC", "Car pickup 8am sharp", "Confirm AWCC Thanksgiving hours"],
    map: "https://www.google.com/maps/dir/?api=1&origin=Ted+Stevens+Anchorage+International+Airport&destination=Coast+Inn+Anchorage&waypoints=Turnagain+Arm+Alaska%7CAlaska+Wildlife+Conservation+Center&travelmode=driving",
    activities: [
      {
        time: "1:40 AM",
        type: "Arrival",
        icon: "plane",
        destination: "Ted Stevens Anchorage International Airport",
        alert: "AZ + SF groups",
        text: "AZ and SF groups land at ANC. Head straight to Coast Inn — SD group arrivals TBC. Get some sleep, big day ahead.",
      },
      {
        time: "8:00 AM",
        type: "Logistics",
        icon: "car",
        destination: "Ted Stevens Anchorage International Airport",
        alert: "All 13 rally here",
        text: "Rental car pickup — 3 vehicles for 13 people (4 AZ, 4 SF, 4 SD, 1 Seattle). Earliest available slot due to Thanksgiving. Confirm winter tires, AWD, and block heaters on all vehicles.",
      },
      {
        time: "10:00 AM",
        type: "Drive",
        icon: "car",
        destination: "Turnagain Arm Alaska",
        text: "Slow breakfast, then head south on Seward Highway. Turnagain Arm is one of the most dramatic coastal drives in North America — sheer cliffs, tidal flats, and possible beluga whale sightings near Beluga Point.",
        photo: "Bore tide + Chugach peaks",
      },
      {
        time: "12:00 PM",
        type: "Wildlife",
        icon: "paw",
        destination: "Alaska Wildlife Conservation Center",
        badge: "Confirm hours",
        alert: "May have reduced Thanksgiving hours",
        text: "Alaska Wildlife Conservation Center — walk-through wildlife park with musk ox, grizzly bears, caribou, moose, and wood bison in natural enclosures. One of the best wildlife experiences in Alaska without going into the backcountry.",
        photo: "Musk ox + snow",
      },
      {
        time: "3:00 PM",
        type: "Explore",
        icon: "sparkles",
        destination: "Downtown Anchorage Alaska",
        text: "Back to Anchorage — explore 4th Avenue, grab food, and settle in. Early night recommended. Tomorrow is a long, full day.",
      },
      {
        time: "Evening",
        type: "Stay",
        icon: "home",
        destination: "Coast Inn Anchorage",
        text: "Overnight at Coast Inn. All 13 together for the first night. Rest well — the real Alaska starts tomorrow.",
      },
    ],
  },
  {
    day: 2,
    date: "Thu, Nov 27",
    title: "Talkeetna + Healy — Thanksgiving",
    stay: "Airbnb, Healy (booked — Sathya)",
    drive: "Anchorage → Talkeetna (~2.5 hrs) → Healy (~1.5 hrs)",
    alerts: ["Thanksgiving day", "Book dinner NOW", "First aurora watch night", "Depart by 9am"],
    map: "https://www.google.com/maps/dir/?api=1&origin=Coast+Inn+Anchorage&destination=Healy+Alaska&waypoints=Talkeetna+Alaska&travelmode=driving",
    activities: [
      {
        time: "9:00 AM",
        type: "Drive",
        icon: "car",
        destination: "Talkeetna Alaska",
        alert: "Depart on time",
        text: "Depart Anchorage by 9am on Parks Highway north. ~2.5 hrs to Talkeetna. Watch for moose along the highway — common in winter.",
      },
      {
        time: "11:30 AM",
        type: "Optional experience",
        icon: "plane",
        destination: "Talkeetna Air Taxi",
        badge: "Optional",
        optional: true,
        bookingKey: "heli-glacier",
        text: "OPTIONAL: Helicopter glacier landing over Denali & Ruth Glacier (~1.5 hrs flight). Talkeetna Air Taxi or K2 Aviation — ~$442–475/person. Group of 13 will need 2 separate flight slots. Call operators directly to coordinate. $15 NPS fee per person at departure.",
        photo: "Ruth Glacier from air",
      },
      {
        time: "1:30 PM",
        type: "Explore",
        icon: "sparkles",
        destination: "Downtown Talkeetna Alaska",
        text: "Explore downtown Talkeetna — a tiny, quirky mountaineering town at the base of Denali. Walk the riverfront, pop into shops, and take in the Denali viewpoint on a clear day.",
        photo: "Denali on clear day",
      },
      {
        time: "6:00 PM",
        type: "Thanksgiving dinner",
        icon: "food",
        destination: "Talkeetna Roadhouse",
        bookingKey: "thanksgiving-dinner",
        alert: "Must book ahead",
        text: "Thanksgiving dinner — Talkeetna Roadhouse or Carlo Creek Lodge en route to Healy. A memorable group meal in the wilderness on Thanksgiving. Call and reserve immediately.",
      },
      {
        time: "8:30 PM",
        type: "Drive",
        icon: "car",
        destination: "Healy Alaska",
        text: "Drive Talkeetna → Healy (~1.5 hrs). Arrive and settle into the Airbnb.",
      },
      {
        time: "10:00 PM",
        type: "Aurora watch",
        icon: "stars",
        destination: "Healy Alaska",
        text: "First aurora opportunity — Healy has minimal light pollution and sits deep in the interior. Step outside after 10pm and check the sky. KP index apps: Space Weather Live or My Aurora Forecast.",
        photo: "Aurora over dark sky",
      },
    ],
    bookings: [
      {
        key: "heli-glacier",
        name: "Helicopter Glacier Landing (Optional)",
        notes: "Talkeetna Air Taxi: (907) 733-2218 | K2 Aviation: (907) 733-2291. Book 2 separate flights for 13 people. Weather-dependent — call the night before to confirm.",
        link: "https://www.talkeetnaair.com",
      },
      {
        key: "thanksgiving-dinner",
        name: "Thanksgiving Dinner",
        notes: "Talkeetna Roadhouse: (907) 733-1351. Carlo Creek Lodge as backup. Book for 13 people — call immediately.",
        link: "https://talkeetnaroadhouse.com",
      },
    ],
  },
  {
    day: 3,
    date: "Fri, Nov 28",
    title: "Full Denali Day — Dog Sledding",
    stay: "Airbnb, Healy (booked — Sathya)",
    drive: "Healy → Denali National Park entrance → Healy (loop)",
    alerts: ["Dog sledding — book ahead", "Only 5 hrs daylight", "Aurora night 2"],
    map: "https://www.google.com/maps/dir/?api=1&origin=Healy+Alaska&destination=Healy+Alaska&waypoints=Denali+National+Park+Visitor+Center&travelmode=driving",
    activities: [
      {
        time: "9:00 AM",
        type: "Dog sledding",
        icon: "paw",
        destination: "Healy Alaska",
        bookingKey: "dog-sled-healy",
        badge: "Book ahead",
        alert: "Primary — Chena is backup",
        text: "Dog sledding near Healy — authentic kennel experience, less touristy than Chena. Half-day program. Currently reaching out to local operators. Chena Hot Springs (Nov 30) is the backup if Healy doesn't come through. Approximate cost: $150–200/person.",
        photo: "Sled dogs in snow",
      },
      {
        time: "12:00 PM",
        type: "National Park",
        icon: "mountain",
        destination: "Denali National Park Visitor Center",
        text: "Denali National Park visitor area — winter trails, ranger talks, and the iconic park entrance. Only ~5 hours of daylight in late November means golden light practically all afternoon. Snowshoe rentals available nearby.",
        photo: "Denali entrance in winter",
      },
      {
        time: "2:00 PM",
        type: "Winter activity",
        icon: "snowflake",
        destination: "Healy Alaska",
        badge: "Optional",
        optional: true,
        text: "OPTIONAL: Snowmobile tours or ice fishing with local Healy operators. Good afternoon filler after the dog sled morning. Ask your Airbnb host for operator recommendations.",
      },
      {
        time: "5:00 PM",
        type: "Photography",
        icon: "camera",
        destination: "Denali National Park",
        text: "Blue-hour photography window — in late November the sky turns deep indigo by 4pm. The Denali entrance and surrounding peaks are spectacular. This is one of the best photo opportunities of the trip.",
        photo: "Blue hour over Alaska Range",
      },
      {
        time: "10:00 PM",
        type: "Aurora watch",
        icon: "stars",
        destination: "Healy Alaska",
        text: "Aurora night 2 — consecutive clear nights are common in interior Alaska. Bundle up and watch from outside the Airbnb. Best aurora windows: 10pm–2am.",
      },
    ],
    bookings: [
      {
        key: "dog-sled-healy",
        name: "Dog Sledding — Healy Area",
        notes: "Currently contacting local kennels. Earthsong Lodge is a good option: (907) 683-2863. Chena Hot Springs is the confirmed backup for Nov 30. Update this booking once confirmed.",
        link: "https://www.earthsongalaska.com",
      },
    ],
  },
  {
    day: 4,
    date: "Sat, Nov 29",
    title: "Drive to Fairbanks — Aurora Tour",
    stay: "Airbnb, Fairbanks (booked — Monish) — night 1 of 2",
    drive: "Healy → Fairbanks (~2 hrs on Parks Highway)",
    alerts: ["Arrive midday", "Aurora guided tour tonight", "Book tour now"],
    map: "https://www.google.com/maps/dir/?api=1&origin=Healy+Alaska&destination=Fairbanks+Alaska&travelmode=driving",
    activities: [
      {
        time: "10:00 AM",
        type: "Drive",
        icon: "car",
        destination: "Fairbanks Alaska",
        text: "Depart Healy ~10am. ~2 hrs north on Parks Highway to Fairbanks. Easy, scenic drive — watch for moose and fox.",
      },
      {
        time: "12:30 PM",
        type: "Check-in",
        icon: "home",
        destination: "Fairbanks Alaska",
        text: "Arrive Fairbanks, check into Monish's Airbnb, grab lunch, and freshen up. You now have 2 full nights in the aurora capital of Alaska.",
      },
      {
        time: "2:00 PM",
        type: "Museum",
        icon: "sparkles",
        destination: "University of Alaska Museum of the North Fairbanks",
        text: "University of Alaska Museum of the North — one of Alaska's finest museums. Natural history, Alaska Native art, a dedicated aurora exhibit, and a stunning building overlooking the Alaska Range. Allow 2 hours.",
        photo: "Museum + Alaska Range backdrop",
      },
      {
        time: "4:30 PM",
        type: "Explore",
        icon: "sparkles",
        destination: "Pioneer Park Fairbanks Alaska",
        text: "Pioneer Park — free outdoor heritage park with historic gold rush buildings, a sternwheeler, and local character. Great for a short evening walk before the aurora tour.",
      },
      {
        time: "9:00 PM",
        type: "Aurora tour",
        icon: "stars",
        destination: "Fairbanks Alaska",
        bookingKey: "aurora-tour-fairbanks",
        badge: "Book now",
        alert: "Highest probability aurora night",
        text: "Guided Northern Lights tour — your best aurora night. Local guides track the KP index in real time and drive the group to clear skies away from city light. 3–4 hour tour. Operators: Northern Alaska Tour Co., Viator aurora tours. ~$80–120/person.",
        photo: "Aurora curtains over spruce forest",
      },
    ],
    bookings: [
      {
        key: "aurora-tour-fairbanks",
        name: "Guided Aurora Tour — Fairbanks",
        notes: "Northern Alaska Tour Co: (907) 474-8600. Book for 13 people — confirm they can accommodate the group. Guides drive to clear skies in real time. Dress in your warmest layers.",
        link: "https://www.northernalaskatour.com",
      },
    ],
  },
  {
    day: 5,
    date: "Sun, Nov 30",
    title: "Chena Hot Springs — Full Day",
    stay: "Airbnb, Fairbanks (booked — Monish) — night 2 of 2",
    drive: "Fairbanks → Chena Hot Springs Resort (~1 hr each way, 56 miles east)",
    alerts: ["Book Ice Museum + dog sled + hot springs now", "Dog sled backup if Healy didn't happen", "Best aurora spot of the trip"],
    map: "https://www.google.com/maps/dir/?api=1&origin=Fairbanks+Alaska&destination=Chena+Hot+Springs+Resort+Alaska&travelmode=driving",
    activities: [
      {
        time: "9:00 AM",
        type: "Drive",
        icon: "car",
        destination: "Chena Hot Springs Resort Alaska",
        text: "Depart Fairbanks by 9am — ~1 hr east to Chena Hot Springs Resort (Chena Hot Springs Road). Easy, flat drive through boreal forest. Great moose habitat along the way.",
      },
      {
        time: "10:00 AM",
        type: "Ice Museum",
        icon: "snowflake",
        destination: "Chena Hot Springs Resort Alaska",
        bookingKey: "chena-ice-museum",
        badge: "Book ahead",
        text: "Aurora Ice Museum — the world's largest year-round ice environment. Stunning ice sculptures carved by world champion artists, maintained at 20°F year-round. ~$15/person. Reserve entry in advance at chenahotsprings.com.",
        photo: "Ice sculptures in blue light",
      },
      {
        time: "11:30 AM",
        type: "Dog sledding",
        icon: "paw",
        destination: "Chena Hot Springs Resort Alaska",
        bookingKey: "chena-dog-sled",
        badge: "Backup or primary",
        alert: "Book directly with resort",
        text: "Dog sled ride at Chena — excellent on-site kennel program with experienced mushers. If Healy dog sledding didn't happen, this is your day. If it did — this is a bonus. Book directly with the resort. ~$100–150/person.",
        photo: "Dog sled team in forest",
      },
      {
        time: "1:30 PM",
        type: "Lunch",
        icon: "food",
        destination: "Chena Hot Springs Resort Alaska",
        text: "Lunch at the resort restaurant — warm up before the hot springs. The Aurora Winter Package includes meals if booked.",
      },
      {
        time: "3:00 PM",
        type: "Hot springs",
        icon: "waves",
        destination: "Chena Hot Springs Resort Alaska",
        bookingKey: "chena-hot-springs",
        badge: "Book ahead",
        text: "Natural geothermal hot spring soak — outdoor pools, open sky, surrounded by snow-covered boreal forest. The aurora-watching-while-soaking experience is the signature Chena moment. Swimsuit required. Towels available at resort.",
        photo: "Soaking under aurora sky",
      },
      {
        time: "9:00 PM",
        type: "Aurora watch",
        icon: "stars",
        destination: "Chena Hot Springs Resort Alaska",
        text: "Aurora watch from Chena — one of Alaska's premier dark-sky locations. The resort offers guided on-site aurora viewing. Stay as long as the sky cooperates before driving back.",
        photo: "Aurora over hot springs steam",
      },
      {
        time: "11:00 PM",
        type: "Drive",
        icon: "car",
        destination: "Fairbanks Alaska",
        text: "Drive back to Fairbanks (~1 hr). Final night in the Fairbanks Airbnb. Early start tomorrow — pack tonight.",
      },
    ],
    bookings: [
      {
        key: "chena-ice-museum",
        name: "Aurora Ice Museum — Chena",
        notes: "Book at chenahotsprings.com or call (907) 451-8104. ~$15/person. Reserve for 13.",
        link: "https://www.chenahotsprings.com",
      },
      {
        key: "chena-dog-sled",
        name: "Dog Sled Ride — Chena",
        notes: "Book directly with Chena Hot Springs Resort: (907) 451-8104. Primary if Healy booking doesn't work out.",
        link: "https://www.chenahotsprings.com",
      },
      {
        key: "chena-hot-springs",
        name: "Hot Springs Access — Chena",
        notes: "Book hot spring access at chenahotsprings.com. Swimsuit required, towels available at resort.",
        link: "https://www.chenahotsprings.com",
      },
    ],
  },
  {
    day: 6,
    date: "Mon, Dec 1",
    title: "Drive Back to Anchorage",
    stay: "Coast Inn, Anchorage (booked — Chandana, Chaitra, Monish)",
    drive: "Fairbanks → Anchorage (~6–7 hrs on Parks Highway)",
    alerts: ["LEAVE BY 9–10AM — non-negotiable", "Long drive on icy roads", "Group farewell dinner tonight", "Pack tonight"],
    map: "https://www.google.com/maps/dir/?api=1&origin=Fairbanks+Alaska&destination=Coast+Inn+Anchorage&travelmode=driving",
    activities: [
      {
        time: "7:30 AM",
        type: "Pack + breakfast",
        icon: "home",
        destination: "Fairbanks Alaska",
        alert: "Pack everything tonight",
        text: "Final Fairbanks breakfast. Last coffee, last souvenirs. Everything should already be packed from the night before.",
      },
      {
        time: "9:00 AM",
        type: "Drive",
        icon: "car",
        destination: "Anchorage Alaska",
        alert: "Depart by 9–10am latest",
        text: "Depart Fairbanks — 6–7 hrs south on Parks Highway (AK-3). Well-maintained and plowed but icy in sections. Drive in convoy, keep speeds moderate. Watch for moose at dusk — common along the highway. Do not stop driving after dark if avoidable.",
      },
      {
        time: "En route",
        type: "Scenic stop",
        icon: "mountain",
        destination: "Denali Viewpoint Parks Highway",
        badge: "Optional",
        optional: true,
        text: "OPTIONAL: Pull over at Denali viewpoints on the Parks Highway southbound — the mountain looks different from the south. Also consider a short stop in Wasilla or Palmer for lunch and fuel.",
        photo: "Denali from Parks Highway",
      },
      {
        time: "4:30 PM",
        type: "Arrive",
        icon: "home",
        destination: "Coast Inn Anchorage",
        text: "Arrive Anchorage ~4–5pm. Check into Coast Inn. Shower, rest, and celebrate — you just drove the full Alaska interior loop.",
      },
      {
        time: "7:00 PM",
        type: "Farewell dinner",
        icon: "food",
        destination: "Anchorage Alaska",
        badge: "Group moment",
        text: "Group farewell dinner — all 13 together one last time. Anchorage has great options: Glacier Brewhouse, 49th State Brewing, or Moose's Tooth Pub for a casual group vibe. Make a reservation for 13.",
        photo: "Group dinner",
      },
      {
        time: "After dinner",
        type: "Prep",
        icon: "clock",
        destination: "Coast Inn Anchorage",
        alert: "SD + SF: pack for 3pm tomorrow",
        text: "Pack for tomorrow. SD and SF groups need bags ready for a 3pm departure. AZ group (4 people) stays until 11pm. Return plan: 2 cars dropped at ANC by 1pm, 1 car kept by AZ group until 8:30pm.",
      },
    ],
  },
  {
    day: 7,
    date: "Tue, Dec 2",
    title: "Last Morning — Everyone Flies Home",
    stay: "Travel Day",
    drive: "Coast Inn → ANC Airport",
    alerts: ["SD + SF depart 4pm — drop cars by 1pm", "AZ group departs 11pm", "Alaska Native Heritage Center open Mon–Fri 9–5 (free in winter)", "Return all cars fuelled"],
    map: "https://www.google.com/maps/dir/?api=1&origin=Coast+Inn+Anchorage&destination=Ted+Stevens+Anchorage+International+Airport&travelmode=driving",
    activities: [
      {
        time: "9:00 AM",
        type: "Explore",
        icon: "sparkles",
        destination: "Alaska Native Heritage Center Anchorage",
        text: "Alaska Native Heritage Center — Alaska's premier cultural destination. Free self-guided entry in winter (Mon–Fri, 9am–5pm). Village sites, films, Hall of Cultures, and art gallery. Allow 1.5 hrs. A meaningful final Anchorage experience.",
        photo: "Village sites in snow",
      },
      {
        time: "11:00 AM",
        type: "Brunch",
        icon: "food",
        destination: "Snow City Cafe Anchorage",
        text: "Brunch at Snow City Cafe — Anchorage institution. Beloved by locals, great food, and a fitting final meal as a full group of 13.",
      },
      {
        time: "12:00 PM",
        type: "Logistics",
        icon: "car",
        destination: "Ted Stevens Anchorage International Airport",
        alert: "SD + SF groups",
        text: "SD and SF groups (8 people + Seattle person if departing 4pm) head to ANC. Drop 2 rental cars at the airport. Check in, bag drop, security. Depart ~3pm.",
      },
      {
        time: "1:00 PM",
        type: "Scenic drive",
        icon: "mountain",
        destination: "Beluga Point Alaska",
        badge: "AZ group only",
        text: "AZ group (4 people, 1 car): scenic drive south on Seward Highway to Beluga Point — stunning fjord views, possible beluga sightings even in December. ~30 min each way. Easy pull-over stop, no hiking needed.",
        photo: "Turnagain Arm + mountains",
      },
      {
        time: "3:30 PM",
        type: "Explore",
        icon: "sparkles",
        destination: "Downtown Anchorage Alaska",
        badge: "AZ group only",
        text: "AZ group: downtown Anchorage afternoon — coffee, last gift shopping, REI for any final Alaska gear. Relax before the long flight home.",
      },
      {
        time: "7:00 PM",
        type: "Dinner",
        icon: "food",
        destination: "Anchorage Alaska",
        badge: "AZ group only",
        text: "Last dinner in Anchorage — a quiet send-off for the AZ group of 4 before heading to the airport.",
      },
      {
        time: "8:30 PM",
        type: "Logistics",
        icon: "car",
        destination: "Ted Stevens Anchorage International Airport",
        alert: "AZ group — return last car",
        text: "AZ group drives to ANC, returns the final rental car. Allow 30 min for fuel, inspection, and shuttle to terminal. Check in by 9pm for the 11pm departure.",
      },
      {
        time: "11:00 PM",
        type: "Departure",
        icon: "plane",
        destination: "Ted Stevens Anchorage International Airport",
        alert: "All groups departed",
        text: "AZ group departs ANC at 11pm. That's a wrap — 7 days, 13 people, 3 cities, 4 aurora nights, and one unforgettable Alaska winter adventure.",
      },
    ],
  },
];

const iconMap: Record<string, string> = {
  previous: "←",
  next: "→",
  car: "🚗",
  home: "🏠",
  plane: "✈️",
  waves: "🌊",
  mountain: "🏔️",
  snowflake: "❄️",
  paw: "🐾",
  sparkles: "✨",
  clock: "🕐",
  map: "📍",
  external: "↗",
  camera: "📷",
  alert: "⚠️",
  ticket: "🎟️",
  stars: "🌌",
  food: "🍽️",
};

function runDataTests(inputDays: TripDay[]) {
  const errors: string[] = [];
  if (!Array.isArray(inputDays)) { errors.push("Days must be an array."); return errors; }
  if (inputDays.length !== 7) errors.push("Should contain 7 days.");
  const seenDays = new Set<number>();
  inputDays.forEach((day, i) => {
    if (!day || typeof day !== "object") { errors.push(`Entry ${i + 1} must be an object.`); return; }
    if (day.day !== i + 1) errors.push(`Day at index ${i} should be numbered ${i + 1}.`);
    if (seenDays.has(day.day)) errors.push(`Duplicate day number: ${day.day}.`);
    seenDays.add(day.day);
    if (!day.title) errors.push(`Day ${i + 1} missing title.`);
    if (!day.date) errors.push(`Day ${i + 1} missing date.`);
    if (!day.stay) errors.push(`Day ${i + 1} missing stay.`);
    if (!day.drive) errors.push(`Day ${i + 1} missing drive.`);
    if (!Array.isArray(day.alerts)) errors.push(`Day ${i + 1} missing alerts array.`);
    if (!day.map || !day.map.startsWith("https://www.google.com/maps")) errors.push(`Day ${i + 1} missing valid map link.`);
    if (!Array.isArray(day.activities) || day.activities.length === 0) { errors.push(`Day ${i + 1} must have activities.`); return; }
    const bookingKeys = new Set((day.bookings || []).map(b => b.key));
    day.activities.forEach((act, ai) => {
      if (!act.time) errors.push(`Day ${i + 1}, act ${ai + 1} missing time.`);
      if (!act.type) errors.push(`Day ${i + 1}, act ${ai + 1} missing type.`);
      if (!act.text) errors.push(`Day ${i + 1}, act ${ai + 1} missing text.`);
      if (!act.icon) errors.push(`Day ${i + 1}, act ${ai + 1} missing icon.`);
      if (act.icon && !iconMap[act.icon]) errors.push(`Day ${i + 1}, act ${ai + 1} unknown icon: ${act.icon}`);
      if (!act.destination) errors.push(`Day ${i + 1}, act ${ai + 1} missing destination.`);
      if (act.bookingKey && day.bookings && !bookingKeys.has(act.bookingKey)) errors.push(`Day ${i + 1}, act ${ai + 1} references missing booking key: ${act.bookingKey}`);
    });
  });
  return errors;
}

const dataErrors = runDataTests(days);

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`inline-flex h-5 w-5 shrink-0 items-center justify-center text-base leading-none ${className}`} aria-hidden="true">
      {iconMap[name] || "•"}
    </span>
  );
}

function findBooking(day: TripDay, activity: Activity) {
  if (!activity.bookingKey || !day.bookings) return null;
  return day.bookings.find(b => b.key === activity.bookingKey) || null;
}

function NavBtn({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  const base = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-[0.99]";
  const cls = primary
    ? `${base} bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-400`
    : `${base} border border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800`;
  return <a href={href} target="_blank" rel="noreferrer" className={cls}>{children}</a>;
}

function DaySwitcher({ active, setActive, compact = false }: { active: number; setActive: React.Dispatch<React.SetStateAction<number>>; compact?: boolean }) {
  function go(dir: number) {
    setActive(v => Math.max(0, Math.min(days.length - 1, v + dir)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return (
    <div className={`grid grid-cols-[1fr_auto_1fr] items-center gap-2 ${compact ? "mt-3" : "mb-5"}`}>
      <button type="button" onClick={() => go(-1)} disabled={active === 0}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm">
        <Icon name="previous" /> Prev
      </button>
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center text-xs font-bold text-emerald-200 sm:text-sm">
        Day {days[active].day} / 7
      </div>
      <button type="button" onClick={() => go(1)} disabled={active === days.length - 1}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm">
        Next <Icon name="next" />
      </button>
    </div>
  );
}

function QuickJump({ active, setActive }: { active: number; setActive: React.Dispatch<React.SetStateAction<number>> }) {
  return (
    <section className="-mx-3 mb-5 flex gap-2 overflow-x-auto px-3 pb-2 sm:mx-0 sm:mb-8 sm:px-0">
      {days.map((day, i) => (
        <button key={day.day} type="button" onClick={() => { setActive(i); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          aria-pressed={active === i}
          className={`min-h-11 min-w-[60px] shrink-0 rounded-xl border px-3 py-2 text-center text-xs font-bold transition active:scale-[0.99] sm:min-w-[76px] sm:text-sm ${
            active === i
              ? "border-emerald-400 bg-emerald-500/15 text-white shadow-lg shadow-emerald-500/10"
              : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-100"
          }`}>
          <div>Day {day.day}</div>
          <div className="mt-0.5 text-[10px] font-normal opacity-70">{day.date.split(",")[0]}</div>
        </button>
      ))}
    </section>
  );
}

function BookingPanel({ day }: { day: TripDay }) {
  const bookings = day.bookings || [];
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 sm:p-6">
      <h3 className="mb-4 text-base font-bold text-white">Booking references</h3>
      {bookings.length === 0 ? (
        <p className="text-sm leading-relaxed text-zinc-500">No pre-booked activities on this day. Add confirmation numbers here when you book.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b.key} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="font-semibold text-white">{b.name}</div>
              {b.confirmation && <div className="mt-1 text-sm text-zinc-300">Confirmation: {b.confirmation}</div>}
              {b.time && <div className="mt-1 text-sm text-zinc-300">Time: {b.time}</div>}
              {b.meetingPoint && <div className="mt-1 text-sm text-zinc-300">Meeting: {b.meetingPoint}</div>}
              {b.notes && <div className="mt-2 text-sm leading-relaxed text-zinc-400">{b.notes}</div>}
              {b.link && (
                <a href={b.link} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-400 hover:text-emerald-300">
                  Open booking <Icon name="external" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AuroraBar() {
  const nights = [
    { day: 2, label: "Nov 27", loc: "Healy" },
    { day: 3, label: "Nov 28", loc: "Healy" },
    { day: 4, label: "Nov 29", loc: "Fairbanks", guided: true },
    { day: 5, label: "Nov 30", loc: "Chena", guided: true },
  ];
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 sm:p-6">
      <h3 className="mb-3 text-base font-bold text-white">Aurora viewing nights</h3>
      <div className="grid grid-cols-4 gap-2">
        {nights.map(n => (
          <div key={n.label} className={`rounded-xl border p-3 text-center ${n.guided ? "border-emerald-500/50 bg-emerald-500/10" : "border-zinc-700 bg-zinc-950/60"}`}>
            <div className="text-lg">🌌</div>
            <div className={`mt-1 text-xs font-bold ${n.guided ? "text-emerald-300" : "text-zinc-300"}`}>{n.label}</div>
            <div className="text-[10px] text-zinc-500">{n.loc}</div>
            {n.guided && <div className="mt-1 text-[10px] font-semibold text-emerald-400">guided</div>}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-zinc-500">4 potential aurora nights. Guided tours on Nov 29–30 chase clear skies in real time for the best odds.</p>
    </div>
  );
}

function GroupInfo() {
  const groups = [
    { city: "AZ", count: 4, departs: "11pm Dec 2", color: "text-sky-300" },
    { city: "SF", count: 4, departs: "3pm Dec 2", color: "text-violet-300" },
    { city: "SD", count: 4, departs: "3pm Dec 2", color: "text-amber-300" },
    { city: "SEA", count: 1, departs: "TBC", color: "text-rose-300" },
  ];
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 sm:p-6">
      <h3 className="mb-3 text-base font-bold text-white">Group breakdown</h3>
      <div className="space-y-2">
        {groups.map(g => (
          <div key={g.city} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm">
            <span className={`font-bold ${g.color}`}>{g.city} · {g.count} people</span>
            <span className="text-zinc-500 text-xs">Departs {g.departs}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-zinc-500">All land ANC ~1:40am Nov 26. Car pickup 8am. 3 vehicles for 13 people.</p>
    </div>
  );
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.trim() === TRIP_PASSWORD) { localStorage.setItem(PASSWORD_STORAGE_KEY, "true"); onUnlock(); return; }
    setErr("Wrong password. Try again.");
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl shadow-black/40">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 text-5xl">🌌</div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-emerald-400">Private Trip App</p>
          <h1 className="text-3xl font-bold text-white">Alaska 2025</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">13 people · Nov 26 – Dec 2 · Anchorage · Healy · Fairbanks</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="pw" className="mb-2 block text-sm font-semibold text-zinc-300">Trip password</label>
            <input id="pw" type="password" value={pw}
              onChange={e => { setPw(e.target.value); setErr(""); }}
              className="min-h-12 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-base text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              placeholder="Enter password" autoComplete="current-password" />
            {err && <p className="mt-2 text-sm font-medium text-red-400">{err}</p>}
          </div>
          <button type="submit" className="min-h-12 w-full rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-[0.99]">
            Unlock itinerary
          </button>
        </form>
        <p className="mt-5 text-center text-xs leading-relaxed text-zinc-600">Share this link and the password with your travel group only.</p>
      </div>
    </div>
  );
}

export default function AlaskaTripApp() {
  const [hasAccess, setHasAccess] = useState(false);
  const [checkedAccess, setCheckedAccess] = useState(false);
  const [active, setActive] = useState(0);
  const current = days[active] || days[0];
  const firstDest = current.activities.find(a => a.destination)?.destination;
  const routeSummary = useMemo(() => days.map(d => `Day ${d.day}: ${d.title}`).join(" · "), []);

  useEffect(() => {
    setHasAccess(localStorage.getItem(PASSWORD_STORAGE_KEY) === "true");
    setCheckedAccess(true);
  }, []);

  if (!checkedAccess) return <div className="min-h-screen bg-zinc-950" />;
  if (!hasAccess) return <PasswordGate onUnlock={() => setHasAccess(true)} />;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 [padding-bottom:env(safe-area-inset-bottom)]">
      {/* Aurora glow header effect */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-48 bg-gradient-to-b from-emerald-950/40 to-transparent" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">

        <header className="sticky top-0 z-20 -mx-3 mb-5 border-b border-zinc-800/80 bg-zinc-950/95 px-3 pb-4 pt-3 backdrop-blur sm:static sm:mx-0 sm:mb-8 sm:bg-transparent sm:px-0 sm:pb-8 sm:pt-0">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-400">Alaska Winter Adventure · 2025</p>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                Nov 26 – Dec 2
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                13 friends · Anchorage · Healy · Fairbanks · 4 aurora nights · dog sleds · Chena hot springs
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <NavBtn href={current.map} primary>Day Map <Icon name="external" /></NavBtn>
              {firstDest && <NavBtn href={navLink(firstDest)}>Next Stop <Icon name="external" /></NavBtn>}
            </div>
          </div>
        </header>

        <QuickJump active={active} setActive={setActive} />

        {dataErrors.length > 0 && (
          <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
            <p className="mb-2 font-semibold">Data issues:</p>
            <ul className="list-inside list-disc space-y-1">{dataErrors.map(e => <li key={e}>{e}</li>)}</ul>
          </div>
        )}

        {current.alerts?.length > 0 && (
          <section className="mb-5 rounded-2xl border border-amber-500/25 bg-amber-500/8 p-4 text-amber-100">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold"><Icon name="alert" /> Today's alerts</div>
            <div className="flex flex-wrap gap-2">
              {current.alerts.map(a => (
                <span key={a} className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-100">{a}</span>
              ))}
            </div>
          </section>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={current.day} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.18 }}
            className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">

            {/* Main card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-2xl shadow-black/30 overflow-hidden">
              <div className="border-b border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 sm:p-6 md:p-8">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                  <span className="rounded-full bg-zinc-800 px-3 py-1">{current.date}</span>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-300">Day {current.day} of 7</span>
                </div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">{current.title}</h2>
                <p className="mt-1 text-sm text-zinc-500">{current.drive}</p>
                <DaySwitcher active={active} setActive={setActive} compact />
              </div>

              <div className="p-4 sm:p-6">
                <div className="space-y-3">
                  {current.activities.map((act, i) => {
                    const booking = findBooking(current, act);
                    return (
                      <div key={`${act.time}-${i}`}
                        className={`rounded-xl border p-4 ${act.optional ? "border-zinc-800/60 bg-zinc-950/30" : "border-zinc-800 bg-zinc-950/50"}`}>
                        <div className="sm:grid sm:grid-cols-[130px_1fr] sm:gap-4">
                          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-300 sm:mb-0 sm:mt-0.5">
                            <Icon name="clock" />
                            <span>{act.time}</span>
                          </div>
                          <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                              <Icon name={act.icon} />
                              <span>{act.type}</span>
                              {act.optional && <span className="rounded-full bg-zinc-800 px-2 py-0.5 font-semibold text-zinc-400">optional</span>}
                              {act.badge && <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-semibold text-emerald-300">{act.badge}</span>}
                              {booking && <span className="rounded-full bg-sky-500/15 px-2 py-0.5 font-semibold text-sky-300"><Icon name="ticket" /> booked</span>}
                              {act.alert && <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-semibold text-amber-200"><Icon name="alert" /> {act.alert}</span>}
                              {act.photo && <span className="rounded-full bg-violet-500/15 px-2 py-0.5 font-semibold text-violet-200"><Icon name="camera" /> {act.photo}</span>}
                            </div>
                            <p className={`text-sm leading-relaxed sm:text-base ${act.optional ? "text-zinc-400" : "text-zinc-100"}`}>{act.text}</p>
                            {booking && (
                              <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/8 p-3 text-sm text-emerald-100">
                                <div className="font-semibold">{booking.name}</div>
                                {booking.confirmation && <div className="mt-1 text-emerald-200/80">Confirmation: {booking.confirmation}</div>}
                                {booking.meetingPoint && <div className="mt-1 text-emerald-200/80">Meeting: {booking.meetingPoint}</div>}
                              </div>
                            )}
                            <div className="mt-3 flex flex-wrap gap-2">
                              {act.destination && (
                                <NavBtn href={navLink(act.destination)}>Navigate <Icon name="external" /></NavBtn>
                              )}
                              {booking?.link && (
                                <NavBtn href={booking.link}>Booking <Icon name="external" /></NavBtn>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Overnight stay</div>
                    <p className="text-sm text-zinc-100">{current.stay}</p>
                  </div>
                  <div className="border-t border-zinc-800 pt-4">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Route</div>
                    <p className="text-sm text-zinc-400">{current.drive}</p>
                  </div>
                  <NavBtn href={current.map} primary>Open Google Maps <Icon name="external" /></NavBtn>
                </div>
              </div>

              <BookingPanel day={current} />
              <AuroraBar />
              <GroupInfo />

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5">
                <h3 className="mb-3 text-base font-bold text-white">Legend</h3>
                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                  <span className="flex items-center gap-2"><Icon name="mountain" /> Natural wonder</span>
                  <span className="flex items-center gap-2"><Icon name="snowflake" /> Ice / glacier</span>
                  <span className="flex items-center gap-2"><Icon name="stars" /> Aurora</span>
                  <span className="flex items-center gap-2"><Icon name="paw" /> Wildlife / sleds</span>
                  <span className="flex items-center gap-2"><Icon name="alert" /> Alert</span>
                  <span className="flex items-center gap-2"><Icon name="ticket" /> Booking</span>
                  <span className="flex items-center gap-2"><Icon name="camera" /> Photo spot</span>
                  <span className="flex items-center gap-2"><span className="text-zinc-600 text-xs">dim</span> Optional</span>
                </div>
              </div>
            </aside>
          </motion.div>
        </AnimatePresence>

        <footer className="mt-8 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-4 text-xs leading-relaxed text-zinc-600 sm:p-5 sm:text-sm">
          <span className="font-semibold text-zinc-400">Full route: </span>{routeSummary}
        </footer>
      </div>
    </div>
  );
}

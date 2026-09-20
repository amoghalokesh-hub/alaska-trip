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
  stayAddress: string;
  drive: string;
  wakeUp: string;
  clothing: string[];
  alerts: string[];
  map: string;
  activities: Activity[];
  bookings?: Booking[];
};

const TRIP_PASSWORD = "alaska2026";
const PASSWORD_STORAGE_KEY = "alaska-trip-2026-access";

function navLink(destination: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`;
}

const days: TripDay[] = [
  {
    day: 1,
    date: "Wed, Nov 26",
    title: "Arrival — Anchorage",
    stay: "Coast Inn at Lake Hood",
    stayAddress: "3450 Aviation Ave, Anchorage, AK 99502",
    drive: "ANC Airport → Coast Inn → Turnagain Arm → AWCC → Downtown Anchorage",
    wakeUp: "7:00am — car pickup at 8am, don't be late!",
    clothing: [
      "Heavy insulated winter jacket",
      "Thermal base layers (top + bottom)",
      "Waterproof snow pants",
      "Insulated waterproof boots",
      "Wool hat + gloves + neck gaiter",
      "Hand warmers in pockets",
    ],
    alerts: [
      "SD lands 12:58am · Everyone else 1:40am",
      "3 rental cars pickup 8am sharp — Monish, Aditya, Jose",
      "Confirm AWCC Thanksgiving hours before going",
      "Light day — recovery from overnight flights",
    ],
    map: "https://www.google.com/maps/dir/?api=1&origin=Ted+Stevens+Anchorage+International+Airport&destination=Coast+Inn+Lake+Hood+Anchorage&waypoints=Turnagain+Arm+Alaska%7CAlaska+Wildlife+Conservation+Center&travelmode=driving",
    activities: [
      {
        time: "12:58am",
        type: "Arrival",
        icon: "plane",
        destination: "Ted Stevens Anchorage International Airport",
        alert: "SD group first",
        text: "SD group (AS 597 from LAX) lands first at 12:58am. AZ, SF and SEA groups all land at 1:40am on DL 2367 from SEA. Head straight to Coast Inn at Lake Hood — booked from Nov 25 so check-in ready.",
      },
      {
        time: "8:00am",
        type: "Logistics",
        icon: "car",
        destination: "Ted Stevens Anchorage International Airport",
        alert: "All 13 rally here",
        text: "Car pickup at ANC airport — 3 SUVs. Monish (Hertz/Enterprise), Jose (Hertz/Enterprise), Aditya (Hertz). Confirm winter tires, AWD, and block heaters on all vehicles. Split 13 people across 3 cars.",
      },
      {
        time: "10:00am",
        type: "Scenic drive",
        icon: "mountain",
        destination: "Beluga Point Turnagain Arm Alaska",
        text: "Turnagain Arm scenic drive south on Seward Highway. One of the most dramatic coastal drives in North America — sheer Chugach peaks, tidal flats, and possible beluga whale sightings at Beluga Point.",
        photo: "Bore tide + Chugach peaks",
      },
      {
        time: "12:00pm",
        type: "Wildlife",
        icon: "paw",
        destination: "Alaska Wildlife Conservation Center Portage Alaska",
        badge: "Confirm hours",
        alert: "Thanksgiving hours may vary",
        text: "Alaska Wildlife Conservation Center — musk ox, grizzly bears, caribou, moose, and wood bison in large natural enclosures. One of the best wildlife experiences in Alaska without going into the backcountry. Call ahead to confirm Thanksgiving day hours.",
        photo: "Musk ox + snow",
      },
      {
        time: "3:00pm",
        type: "Explore",
        icon: "sparkles",
        destination: "Downtown Anchorage Alaska",
        text: "Back to Anchorage — explore 4th Avenue, grab dinner, walk around. Light evening. You've been up since yesterday so get to bed early. Big day tomorrow starts at 6:30am.",
      },
      {
        time: "Evening",
        type: "Stay",
        icon: "home",
        destination: "Coast Inn at Lake Hood Anchorage Alaska",
        text: "Overnight at Coast Inn at Lake Hood. All 13 together for the first night. Pack your bags for tomorrow before sleeping — 6:30am wake-up.",
      },
    ],
  },
  {
    day: 2,
    date: "Thu, Nov 27",
    title: "Ice Cave → Talkeetna → Healy",
    stay: "Lake House Family Retreat @ Denali National Park",
    stayAddress: "2 Otto Lake Rd, Healy, AK 99743",
    drive: "Anchorage → Matanuska Glacier (~2hrs) → Talkeetna (~2.5hrs) → Healy (~1.5hrs)",
    wakeUp: "6:30am — longest driving day, ice cave tour at 10am, must leave by 7:30am",
    clothing: [
      "MANDATORY: Full waterproof shell jacket + pants (you'll be inside glacier ice)",
      "Thermal base layers — top + bottom",
      "Wool mid-layer fleece",
      "Insulated waterproof hiking boots (crampons provided by tour)",
      "Warm hat + balaclava + goggles recommended",
      "Waterproof gloves — NOT regular gloves",
      "Hand + toe warmers — essential inside the cave",
      "Change of dry clothes in the car for after the tour",
    ],
    alerts: [
      "6:30am wake-up — earliest day of the trip",
      "Leave Anchorage by 7:30am sharp",
      "Ice cave tour 10:00am — $160/person — glacier-tours.com",
      "Thanksgiving day — grab food on the go",
      "Arrive Talkeetna ~3–3:30pm for Christmas town vibes",
    ],
    map: "https://www.google.com/maps/dir/?api=1&origin=Coast+Inn+Lake+Hood+Anchorage&destination=Healy+Alaska&waypoints=Matanuska+Glacier+Alaska%7CTalkeetna+Alaska&travelmode=driving",
    activities: [
      {
        time: "6:30am",
        type: "Wake up",
        icon: "clock",
        destination: "Coast Inn at Lake Hood Anchorage Alaska",
        alert: "Earliest start of the trip",
        text: "Wake up 6:30am. Quick breakfast, load cars. Everything should already be packed from the night before. You need to be on the road by 7:30am to make the 10am ice cave tour — no delays.",
      },
      {
        time: "7:30am",
        type: "Drive",
        icon: "car",
        destination: "Matanuska Glacier Alaska",
        text: "Depart Anchorage east on Glenn Highway toward Matanuska Glacier. ~2 hrs drive. Scenic highway through the Matanuska-Susitna Valley with mountain views. Stop for gas/coffee in Palmer (~45 min from Anchorage).",
      },
      {
        time: "9:30am",
        type: "Arrive glacier",
        icon: "mountain",
        destination: "Matanuska Glacier Alaska",
        text: "Arrive Matanuska Glacier. Check in with Glacier Tours guide. Get fitted for crampons and helmets (all provided). The glacier access road is rough — drive slowly (10mph max). Layer up before stepping out — it's significantly colder at the glacier.",
        photo: "Glacier approach",
      },
      {
        time: "10:00am",
        type: "Ice cave tour",
        icon: "snowflake",
        destination: "Matanuska Glacier Alaska",
        bookingKey: "ice-cave",
        badge: "Booked — $160/person",
        alert: "Hard start time",
        text: "Matanuska Glacier Ice Cave Tour — Glacier Tours. 2–2.5 hrs guided walk inside the glacier's ice caves. Stunning blue ice formations, crevasses, and cave chambers only accessible in winter. Crampons, helmets, and guides provided. One of the most unique experiences of the trip.",
        photo: "Blue ice cave walls",
      },
      {
        time: "12:30pm",
        type: "Drive",
        icon: "car",
        destination: "Talkeetna Alaska",
        text: "Leave glacier heading northwest toward Talkeetna (~2.5 hrs). Grab Thanksgiving food on the go — gas station or a quick stop in Wasilla. Winging the meal today!",
      },
      {
        time: "3:00pm",
        type: "Arrive Talkeetna",
        icon: "sparkles",
        destination: "Downtown Talkeetna Alaska",
        text: "Arrive Talkeetna — a tiny quirky mountaineering town draped in early Christmas lights. Walk the wooden boardwalk downtown, visit the river viewpoint, browse the shops and art galleries. The town does a lovely low-key holiday atmosphere in late November.",
        photo: "Talkeetna Christmas lights",
      },
      {
        time: "3:30pm",
        type: "Explore + dinner",
        icon: "food",
        destination: "Talkeetna Roadhouse",
        text: "Explore downtown, grab dinner at Talkeetna Roadhouse, Denali Brewing Company, or whatever is open on Thanksgiving. The town is small but walkable — gives you a real feel of Alaska's mountain culture. Denali viewpoint is worth a stop on a clear evening.",
        photo: "Denali from Talkeetna",
      },
      {
        time: "7:30pm",
        type: "Drive",
        icon: "car",
        destination: "2 Otto Lake Rd Healy Alaska",
        text: "Depart Talkeetna for Healy (~1.5 hrs north on Parks Highway). Arrive at the Lake House Family Retreat around 9–9:30pm. Check in, settle in, and watch for aurora — Healy has excellent dark skies.",
      },
      {
        time: "10:00pm",
        type: "Aurora watch",
        icon: "stars",
        destination: "2 Otto Lake Rd Healy Alaska",
        text: "First aurora opportunity of the trip — Healy sits deep in the interior with minimal light pollution. Step outside and check the sky. Apps to track: Space Weather Live, My Aurora Forecast. Best window: 10pm–2am.",
        photo: "Aurora over Otto Lake",
      },
    ],
    bookings: [
      {
        key: "ice-cave",
        name: "Matanuska Glacier Ice Cave Tour",
        time: "10:00am, Nov 27",
        meetingPoint: "Matanuska Glacier parking area — follow glacier-tours.com directions",
        notes: "$160/person. Crampons + helmets provided. Waterproof gear mandatory. Call if weather is uncertain the night before.",
        link: "https://glacier-tours.com/guided-alaska-glaciers-tours/",
      },
    ],
  },
  {
    day: 3,
    date: "Fri, Nov 28",
    title: "Full Denali Day — Healy",
    stay: "Lake House Family Retreat @ Denali National Park",
    stayAddress: "2 Otto Lake Rd, Healy, AK 99743",
    drive: "Healy → Denali NP entrance → Healy (short loop)",
    wakeUp: "8:30am — rest day, no hard deadlines",
    clothing: [
      "Heavy insulated jacket — coldest day of the trip",
      "Full thermal base layers",
      "Waterproof snow pants",
      "Insulated waterproof boots rated to -20°F or below",
      "Balaclava + wool hat + neck gaiter",
      "Insulated waterproof mittens (warmer than gloves)",
      "Chemical hand warmers + toe warmers",
      "Snowshoe-compatible footwear if renting snowshoes",
    ],
    alerts: [
      "Only ~5 hrs daylight — outdoor activities 10am–3pm",
      "Temperatures may hit single digits °F",
      "Aurora watch tonight — no guided tour, just sky watching",
      "Rest day — no rush, no hard checkouts",
    ],
    map: "https://www.google.com/maps/dir/?api=1&origin=2+Otto+Lake+Rd+Healy+Alaska&destination=2+Otto+Lake+Rd+Healy+Alaska&waypoints=Denali+National+Park+Visitor+Center&travelmode=driving",
    activities: [
      {
        time: "8:30am",
        type: "Wake up",
        icon: "clock",
        destination: "2 Otto Lake Rd Healy Alaska",
        text: "Relaxed wake-up — this is your rest and explore day. Make breakfast at the Lake House. Enjoy Otto Lake views. Plan the day around the limited daylight window (sunrise ~10am, sunset ~3:30pm).",
      },
      {
        time: "10:00am",
        type: "National Park",
        icon: "mountain",
        destination: "Denali National Park Visitor Center",
        text: "Drive to Denali National Park visitor area (~10 min). Winter walking trails, ranger programs, and the iconic park entrance. The landscape is completely silent and snow-covered — otherworldly. Snowshoe rentals available near the entrance.",
        photo: "Denali entrance in winter snow",
      },
      {
        time: "12:00pm",
        type: "Winter activity",
        icon: "snowflake",
        destination: "Denali National Park",
        text: "Snowshoeing in the park — rentals available nearby. With only ~5 hrs of daylight, the light is golden and dramatic practically all afternoon. Perfect for photos. The terrain is accessible even for beginners.",
        photo: "Snowshoe tracks in Denali",
      },
      {
        time: "2:00pm",
        type: "Optional activity",
        icon: "sparkles",
        destination: "Healy Alaska",
        optional: true,
        badge: "Optional",
        text: "OPTIONAL: Snowmobile tours or ice fishing with local Healy operators. Ask your Airbnb host for current recommendations. Good energy filler if the group is up for it after yesterday's long day.",
      },
      {
        time: "3:30pm",
        type: "Photography",
        icon: "camera",
        destination: "Denali National Park",
        text: "Blue-hour photography — by 3:30pm the sky turns deep indigo and violet over the Alaska Range. This is one of the best photography windows of the entire trip. The Denali entrance, Otto Lake, and surrounding peaks are spectacular.",
        photo: "Blue hour Alaska Range",
      },
      {
        time: "6:00pm",
        type: "Dinner",
        icon: "food",
        destination: "Healy Alaska",
        text: "Dinner at the Lake House — cook together or head into Healy for a local meal. Denali Salmon Bake or 49th State Brewing (Healy location) are good options if open.",
      },
      {
        time: "10:00pm",
        type: "Aurora watch",
        icon: "stars",
        destination: "2 Otto Lake Rd Healy Alaska",
        text: "Aurora night 2 — step outside and watch from Otto Lake. Consecutive clear nights are common in interior Alaska. No guided tour tonight, just the group and the sky. Best window: 10pm–2am.",
        photo: "Aurora over Otto Lake",
      },
    ],
  },
  {
    day: 4,
    date: "Sat, Nov 29",
    title: "Healy → Fairbanks",
    stay: "Airbnb Fairbanks",
    stayAddress: "1363 Shuros Drive, Fairbanks, AK 99709",
    drive: "Healy → Fairbanks (~2 hrs on Parks Highway north)",
    wakeUp: "8:30am — easy drive, arrive midday",
    clothing: [
      "Heavy insulated jacket",
      "Thermal base layers",
      "Waterproof snow pants",
      "Insulated boots rated to -20°F",
      "Wool hat + gloves + scarf",
      "Extra warm layer for evening — Fairbanks is colder than Healy",
      "Hand warmers for evening outdoor time",
    ],
    alerts: [
      "Fairbanks is colder than Anchorage — avg 2°F to 12°F in late Nov",
      "Optional: dog sledding today in Fairbanks ($100/person, ~1hr)",
      "Easy driving day — arrive by noon",
      "Aurora watch possible tonight from the Airbnb",
    ],
    map: "https://www.google.com/maps/dir/?api=1&origin=2+Otto+Lake+Rd+Healy+Alaska&destination=1363+Shuros+Drive+Fairbanks+Alaska&travelmode=driving",
    activities: [
      {
        time: "8:30am",
        type: "Wake up + pack",
        icon: "clock",
        destination: "2 Otto Lake Rd Healy Alaska",
        text: "Wake up, pack everything from the Lake House — this is checkout day. Load the 3 cars. Quick breakfast, then head north.",
      },
      {
        time: "10:00am",
        type: "Drive",
        icon: "car",
        destination: "1363 Shuros Drive Fairbanks Alaska",
        text: "Depart Healy north on Parks Highway. ~2 hrs to Fairbanks. Easy scenic drive through boreal forest — watch for moose and fox along the road.",
      },
      {
        time: "12:00pm",
        type: "Check-in",
        icon: "home",
        destination: "1363 Shuros Drive Fairbanks Alaska",
        text: "Arrive Fairbanks, check into the Airbnb at 1363 Shuros Drive. Get settled, grab lunch, and freshen up. 2 full nights in the aurora capital of Alaska.",
      },
      {
        time: "1:30pm",
        type: "Museum",
        icon: "sparkles",
        destination: "University of Alaska Museum of the North Fairbanks",
        text: "University of Alaska Museum of the North — one of Alaska's finest museums. Natural history, Alaska Native art, a dedicated aurora exhibit, and stunning architecture overlooking the Alaska Range. Allow 2 hours.",
        photo: "Museum + Alaska Range",
      },
      {
        time: "3:30pm",
        type: "Dog sledding",
        icon: "paw",
        destination: "Fairbanks Alaska",
        bookingKey: "dog-sled-fairbanks",
        badge: "Optional — $100/person",
        optional: true,
        alert: "OR do it at Chena tomorrow for $75",
        text: "OPTIONAL: Dog sledding in Fairbanks — ~1 hour, more immersive experience with the dogs and musher. $100/person. If the group prefers to save and do the shorter 25-min version at Chena tomorrow for $75, skip this and rest. Decide as a group based on budget and energy.",
      },
      {
        time: "5:30pm",
        type: "Explore",
        icon: "sparkles",
        destination: "Pioneer Park Fairbanks Alaska",
        text: "Pioneer Park — free outdoor heritage park with gold rush era buildings, a historic sternwheeler, and local character. Short evening walk before dinner.",
      },
      {
        time: "7:00pm",
        type: "Dinner",
        icon: "food",
        destination: "Fairbanks Alaska",
        text: "Dinner in Fairbanks — Pike's Landing, The Pump House, or 49th State Brewing. Good group options for 13 people. Make a same-day reservation or arrive early.",
      },
      {
        time: "10:00pm",
        type: "Aurora watch",
        icon: "stars",
        destination: "1363 Shuros Drive Fairbanks Alaska",
        text: "Aurora watch from the Airbnb or drive out to a dark spot nearby. Fairbanks has great KP index activity in late November. No guided tour tonight — Chena tomorrow is your best guided aurora experience.",
        photo: "Aurora over Fairbanks",
      },
    ],
    bookings: [
      {
        key: "dog-sled-fairbanks",
        name: "Dog Sledding — Fairbanks (Optional)",
        notes: "$100/person, ~1 hour. More immersive than Chena's 25-min option. Decide on the day — if skipping, do Chena dog sledding instead tomorrow for $75.",
        link: "https://www.chenahotsprings.com/activities-2/",
      },
    ],
  },
  {
    day: 5,
    date: "Sun, Nov 30",
    title: "Chena Hot Springs — Full Day",
    stay: "Airbnb Fairbanks",
    stayAddress: "1363 Shuros Drive, Fairbanks, AK 99709",
    drive: "Fairbanks → Chena Hot Springs Resort (~1 hr each way, 56 miles east)",
    wakeUp: "8:00am — depart by 9am to make the most of the full day at Chena",
    clothing: [
      "Swimsuit + towel — MANDATORY for hot springs",
      "Heavy insulated jacket for outdoors between activities",
      "Warm layers you can remove easily",
      "Insulated boots for walking between resort buildings",
      "Hat + gloves for outdoor aurora watching",
      "Dry bag or extra clothes set — you'll be wet from hot springs",
      "Flip flops for pool deck (optional but handy)",
    ],
    alerts: [
      "Depart Fairbanks by 9am",
      "Book Ice Museum + dog sled + hot springs at chenahotsprings.com",
      "Aurora guided tour at Chena tonight — included in $145 package",
      "Dog sledding: $75/person 25-min at Chena OR skip if did Fairbanks yesterday",
      "Drive back to Fairbanks ~11pm — pack a warm car snack",
    ],
    map: "https://www.google.com/maps/dir/?api=1&origin=1363+Shuros+Drive+Fairbanks+Alaska&destination=Chena+Hot+Springs+Resort+Alaska&travelmode=driving",
    activities: [
      {
        time: "8:00am",
        type: "Wake up",
        icon: "clock",
        destination: "1363 Shuros Drive Fairbanks Alaska",
        text: "Wake up, pack your swimsuit and towel — don't forget these! Grab breakfast and load the cars. Depart by 9am to have the full day at Chena.",
      },
      {
        time: "9:00am",
        type: "Drive",
        icon: "car",
        destination: "Chena Hot Springs Resort Alaska",
        text: "Drive east from Fairbanks on Chena Hot Springs Road (~1 hr, 56 miles). Flat, scenic boreal forest drive — great moose habitat. Road is well maintained.",
      },
      {
        time: "10:00am",
        type: "Aurora Ice Museum",
        icon: "snowflake",
        destination: "Chena Hot Springs Resort Alaska",
        bookingKey: "chena-package",
        badge: "$145/person package",
        text: "Aurora Ice Museum — the world's largest year-round ice environment maintained at 20°F. Stunning ice sculptures carved by world champion artists. Incredible photo opportunity. Included in the $145 Chena package.",
        photo: "Ice sculptures in blue light",
      },
      {
        time: "11:30am",
        type: "Dog sledding",
        icon: "paw",
        destination: "Chena Hot Springs Resort Alaska",
        bookingKey: "chena-package",
        badge: "Optional — $75/person",
        optional: true,
        alert: "Skip if did Fairbanks dog sled yesterday",
        text: "OPTIONAL: Dog sled ride at Chena — 25 minutes, $75/person. Fun and accessible but shorter than the Fairbanks option. If you did dog sledding in Fairbanks yesterday, skip this and use the time for the hot springs or rest.",
        photo: "Dog sled team in forest",
      },
      {
        time: "1:00pm",
        type: "Lunch",
        icon: "food",
        destination: "Chena Hot Springs Resort Alaska",
        text: "Lunch at the Chena resort restaurant. Warm up properly before heading to the outdoor hot springs. The resort has a full restaurant with good hearty food.",
      },
      {
        time: "2:30pm",
        type: "Hot springs",
        icon: "waves",
        destination: "Chena Hot Springs Resort Alaska",
        bookingKey: "chena-package",
        badge: "Included in $145 package",
        text: "Natural geothermal hot spring soak — outdoor pools, open sky, surrounded by snow-covered boreal forest. Steam rises as the ~106°F water meets freezing air. This is the iconic Chena experience. Towels available at resort. Stay as long as you like.",
        photo: "Hot springs steam in winter air",
      },
      {
        time: "9:00pm",
        type: "Aurora tour",
        icon: "stars",
        destination: "Chena Hot Springs Resort Alaska",
        bookingKey: "chena-package",
        badge: "Guided — included in package",
        alert: "Best aurora night of the trip",
        text: "Guided Northern Lights tour at Chena — included in the $145 package. This is your best aurora opportunity of the entire trip. Chena is one of Alaska's premier dark-sky locations. Guides know the terrain and the sky. Stay out as long as the lights perform.",
        photo: "Aurora curtains over Chena spruce forest",
      },
      {
        time: "11:00pm",
        type: "Drive back",
        icon: "car",
        destination: "1363 Shuros Drive Fairbanks Alaska",
        text: "Drive back to Fairbanks (~1 hr). Last night at the Shuros Drive Airbnb. Pack everything tonight — 7am wake-up tomorrow for the long drive south.",
      },
    ],
    bookings: [
      {
        key: "chena-package",
        name: "Chena Hot Springs — Full Day Package",
        time: "All day, Nov 30",
        meetingPoint: "Chena Hot Springs Resort, 56.5 miles east of Fairbanks on Chena Hot Springs Rd",
        notes: "$145/person — includes Aurora Ice Museum, hot spring access, and guided aurora tour. Dog sledding add-on: $75/person (25 min). Book all at chenahotsprings.com or call (907) 451-8104.",
        link: "https://www.chenahotsprings.com/activities-2/",
      },
    ],
  },
  {
    day: 6,
    date: "Mon, Dec 1",
    title: "Drive Back to Anchorage",
    stay: "Coast Inn at Lake Hood",
    stayAddress: "3450 Aviation Ave, Anchorage, AK 99502",
    drive: "Fairbanks → Anchorage (~6–7 hrs on Parks Highway south)",
    wakeUp: "7:00am — non-negotiable. Long drive day, depart by 8am.",
    clothing: [
      "Comfortable warm layers for a day in the car",
      "Insulated jacket accessible (not buried in bags)",
      "Warm boots — you'll be stopping along the way",
      "Neck pillow + blanket for passengers",
      "Snacks and drinks packed before departure",
    ],
    alerts: [
      "7:00am WAKE UP — non-negotiable",
      "Depart Fairbanks by 8:00am latest",
      "6–7 hrs on Parks Highway — icy in sections",
      "Drive in convoy — all 3 cars together",
      "Group farewell dinner tonight in Anchorage",
      "SD + SF: pack for early 12:14pm departure tomorrow",
    ],
    map: "https://www.google.com/maps/dir/?api=1&origin=1363+Shuros+Drive+Fairbanks+Alaska&destination=Coast+Inn+Lake+Hood+Anchorage+Alaska&travelmode=driving",
    activities: [
      {
        time: "7:00am",
        type: "Wake up + load",
        icon: "clock",
        destination: "1363 Shuros Drive Fairbanks Alaska",
        alert: "Non-negotiable wake-up",
        text: "Wake up 7am. Everything should be packed from last night. Load the 3 cars, grab a quick breakfast or coffee to go. You need wheels rolling by 8am. This is the longest driving day of the trip.",
      },
      {
        time: "8:00am",
        type: "Drive",
        icon: "car",
        destination: "Anchorage Alaska",
        alert: "Depart by 8am",
        text: "Depart Fairbanks south on Parks Highway (AK-3). ~6–7 hrs to Anchorage. Well-maintained and plowed but icy in sections — drive carefully in convoy. Watch for moose especially at dusk. Fuel up in Fairbanks before leaving.",
      },
      {
        time: "En route",
        type: "Scenic stop",
        icon: "mountain",
        destination: "Denali Viewpoint Parks Highway Alaska",
        optional: true,
        badge: "Optional",
        text: "OPTIONAL: Pull over at Denali viewpoints on Parks Highway southbound. The mountain looks completely different from the south. Also consider a quick lunch stop in Wasilla or Talkeetna if time allows.",
        photo: "Denali from Parks Highway south",
      },
      {
        time: "3:00pm",
        type: "Arrive",
        icon: "home",
        destination: "Coast Inn at Lake Hood Anchorage Alaska",
        text: "Arrive Anchorage ~3–4pm. Check into Coast Inn at Lake Hood. Shower, rest, and celebrate — you just completed the Alaska interior loop.",
      },
      {
        time: "7:00pm",
        type: "Farewell dinner",
        icon: "food",
        destination: "Anchorage Alaska",
        badge: "All 13 together",
        text: "Group farewell dinner — all 13 friends together for the last time. Great options for groups: Glacier Brewhouse, 49th State Brewing, or Moose's Tooth Pub. Make a same-day reservation for 13. This is the moment.",
        photo: "Group dinner",
      },
      {
        time: "After dinner",
        type: "Prep",
        icon: "clock",
        destination: "Coast Inn at Lake Hood Anchorage Alaska",
        alert: "SD + SF pack tonight",
        text: "SD and SF groups — pack everything tonight. You have a 12:14pm departure tomorrow and need to be at ANC by 10am. Bags need to be ready to go. AZ group has a relaxed morning.",
      },
    ],
  },
  {
    day: 7,
    date: "Tue, Dec 2",
    title: "Everyone Flies Home",
    stay: "Travel Day",
    stayAddress: "Ted Stevens Anchorage International Airport",
    drive: "Coast Inn → ANC Airport",
    wakeUp: "SD + SF: 6:30am sharp | AZ: relaxed 9am",
    clothing: [
      "Travel-comfortable warm layers",
      "Keep your warmest jacket accessible — not in checked bags",
      "Slip-on shoes for airport security",
      "Compression socks for the long flights home",
    ],
    alerts: [
      "SD + SF: AS 452 departs 12:14pm — be at ANC by 10am",
      "SD + SF: Drop 2 cars at ANC by 10am",
      "AZ: AS 72 departs 10:26pm — return last car by 8:30pm",
      "SEA person departure TBC",
      "Alaska Native Heritage Center open 9am–5pm (free in winter)",
    ],
    map: "https://www.google.com/maps/dir/?api=1&origin=Coast+Inn+Lake+Hood+Anchorage+Alaska&destination=Ted+Stevens+Anchorage+International+Airport&travelmode=driving",
    activities: [
      {
        time: "6:30am",
        type: "Wake up",
        icon: "clock",
        destination: "Coast Inn at Lake Hood Anchorage Alaska",
        alert: "SD + SF groups",
        text: "SD and SF groups wake up 6:30am. Quick breakfast, load bags. You have AS 452 departing at 12:14pm and need to be at ANC checked in by 10am. Drop 2 rental cars at the airport car return.",
      },
      {
        time: "8:30am",
        type: "Airport",
        icon: "plane",
        destination: "Ted Stevens Anchorage International Airport",
        alert: "SD + SF only",
        text: "SD (AS 452→AS 667, arrives SAN 7:37pm) and SF (AS 452→AS 1393, arrives SFO 7:37pm) groups head to ANC. Return 2 rental cars. Check in, bag drop, security, and some airport time before the 12:14pm departure.",
      },
      {
        time: "9:00am",
        type: "Relaxed morning",
        icon: "sparkles",
        destination: "Alaska Native Heritage Center Anchorage",
        badge: "AZ group only",
        text: "AZ group (4 people, 1 car): Alaska Native Heritage Center — free self-guided entry in winter (Mon–Fri 9am–5pm). Hall of Cultures, village sites, films, and art gallery. Allow ~1.5 hrs. A meaningful final Anchorage experience.",
        photo: "Village sites in snow",
      },
      {
        time: "11:00am",
        type: "Brunch",
        icon: "food",
        destination: "Snow City Cafe Anchorage",
        badge: "AZ group only",
        text: "Brunch at Snow City Cafe — Anchorage institution loved by locals. Great food, relaxed vibe, fitting last meal in Alaska.",
      },
      {
        time: "1:00pm",
        type: "Scenic drive",
        icon: "mountain",
        destination: "Beluga Point Turnagain Arm Alaska",
        badge: "AZ group only",
        text: "AZ group: drive south on Seward Highway to Beluga Point. Stunning Turnagain Arm views, possible beluga sightings even in December. ~30 min each way. Easy pull-over, no hiking. The same road you drove Day 1 — a nice full-circle moment.",
        photo: "Turnagain Arm winter",
      },
      {
        time: "4:00pm",
        type: "Explore + dinner",
        icon: "sparkles",
        destination: "Downtown Anchorage Alaska",
        badge: "AZ group only",
        text: "AZ group: last wander through downtown Anchorage. Coffee, souvenir shopping, REI for any gear. Dinner at a favorite spot before heading to the airport.",
      },
      {
        time: "8:30pm",
        type: "Return car",
        icon: "car",
        destination: "Ted Stevens Anchorage International Airport",
        alert: "AZ group — return last car",
        text: "AZ group drives to ANC, returns the final rental car. Allow 30 min for fuel, inspection, and shuttle to terminal. Check in by 9pm for the 10:26pm AS 72 departure to PHX (arrives 6:00am Dec 3).",
      },
      {
        time: "10:26pm",
        type: "Departure",
        icon: "plane",
        destination: "Ted Stevens Anchorage International Airport",
        alert: "AZ — AS 72 to PHX",
        text: "AZ group departs ANC on AS 72 at 10:26pm, arriving Phoenix 6:00am Dec 3. That's a wrap — 7 days, 13 friends, 3 cities, Matanuska ice caves, Denali, Chena hot springs, and the northern lights. What a trip.",
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
  clock: "⏰",
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
  const base = "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-[0.99]";
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
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm">
        <Icon name="previous" /> Prev
      </button>
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center text-xs font-bold text-emerald-200 sm:text-sm">
        Day {days[active].day} / 7
      </div>
      <button type="button" onClick={() => go(1)} disabled={active === days.length - 1}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm">
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
          className={`min-h-11 min-w-[64px] shrink-0 rounded-xl border px-3 py-2 text-center text-xs font-bold transition active:scale-[0.99] sm:min-w-[80px] sm:text-sm ${
            active === i
              ? "border-emerald-400 bg-emerald-500/15 text-white shadow-lg shadow-emerald-500/10"
              : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-100"
          }`}>
          <div>Day {day.day}</div>
          <div className="mt-0.5 text-[10px] font-normal opacity-60">{day.date.split(",")[0]}</div>
        </button>
      ))}
    </section>
  );
}

function ClothingPanel({ day }: { day: TripDay }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-zinc-800/50 transition">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧥</span>
          <span className="font-bold text-white text-sm">What to wear today</span>
        </div>
        <span className="text-zinc-500 text-xs">{open ? "▲ hide" : "▼ show"}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-zinc-800 pt-4">
          <ul className="space-y-2">
            {day.clothing.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function WakeUpBanner({ day }: { day: TripDay }) {
  return (
    <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 flex items-start gap-3">
      <span className="text-2xl shrink-0">⏰</span>
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">Wake-up call</div>
        <div className="text-sm font-semibold text-amber-100">{day.wakeUp}</div>
      </div>
    </div>
  );
}

function BookingPanel({ day }: { day: TripDay }) {
  const bookings = day.bookings || [];
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5">
      <h3 className="mb-4 text-sm font-bold text-white">Booking references</h3>
      {bookings.length === 0 ? (
        <p className="text-sm leading-relaxed text-zinc-500">No pre-booked activities today.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b.key} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="font-semibold text-white text-sm">{b.name}</div>
              {b.confirmation && <div className="mt-1 text-xs text-zinc-300">Confirmation: {b.confirmation}</div>}
              {b.time && <div className="mt-1 text-xs text-zinc-300">⏰ {b.time}</div>}
              {b.meetingPoint && <div className="mt-1 text-xs text-zinc-300">📍 {b.meetingPoint}</div>}
              {b.notes && <div className="mt-2 text-xs leading-relaxed text-zinc-400">{b.notes}</div>}
              {b.link && (
                <a href={b.link} target="_blank" rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300">
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

function AuroraBar({ activeDay }: { activeDay: number }) {
  const nights = [
    { day: 2, label: "Nov 27", loc: "Healy", guided: false },
    { day: 3, label: "Nov 28", loc: "Healy", guided: false },
    { day: 4, label: "Nov 29", loc: "Fairbanks", guided: false },
    { day: 5, label: "Nov 30", loc: "Chena", guided: true },
  ];
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5">
      <h3 className="mb-3 text-sm font-bold text-white">🌌 Aurora nights</h3>
      <div className="grid grid-cols-4 gap-1.5">
        {nights.map(n => (
          <div key={n.label}
            className={`rounded-xl border p-2.5 text-center ${n.guided ? "border-emerald-500/60 bg-emerald-500/10" : "border-zinc-700 bg-zinc-950/60"} ${activeDay === n.day ? "ring-1 ring-emerald-400" : ""}`}>
            <div className="text-base">🌌</div>
            <div className={`mt-1 text-[10px] font-bold ${n.guided ? "text-emerald-300" : "text-zinc-300"}`}>{n.label}</div>
            <div className="text-[9px] text-zinc-500">{n.loc}</div>
            {n.guided && <div className="mt-0.5 text-[9px] font-bold text-emerald-400">guided ★</div>}
          </div>
        ))}
      </div>
      <p className="mt-2.5 text-[10px] leading-relaxed text-zinc-500">4 potential nights. Nov 30 Chena is the guided aurora experience — best odds of the trip.</p>
    </div>
  );
}

function GroupFlights() {
  const arrivals = [
    { city: "SD (4)", flight: "AS 597", route: "LAX→ANC", arrives: "12:58am Nov 26", color: "text-amber-300" },
    { city: "AZ (4)", flight: "DL 2449+2367", route: "PHX→SEA→ANC", arrives: "1:40am Nov 26", color: "text-sky-300" },
    { city: "SF (4)", flight: "DL 4100+2367", route: "SJC→SEA→ANC", arrives: "1:40am Nov 26", color: "text-violet-300" },
    { city: "SEA (1)", flight: "DL 2367", route: "SEA→ANC", arrives: "1:40am Nov 26", color: "text-rose-300" },
  ];
  const departures = [
    { city: "SD (4)", flight: "AS 452+667", departs: "12:14pm", arrives: "SAN 7:37pm", color: "text-amber-300" },
    { city: "SF (4)", flight: "AS 452+1393", departs: "12:14pm", arrives: "SFO 7:37pm", color: "text-violet-300" },
    { city: "AZ (4)", flight: "AS 72", departs: "10:26pm", arrives: "PHX 6am Dec 3", color: "text-sky-300" },
    { city: "SEA (1)", flight: "TBC", departs: "TBC", arrives: "TBC", color: "text-rose-300" },
  ];
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5">
      <h3 className="mb-3 text-sm font-bold text-white">✈️ Group flights</h3>
      <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Arrivals Nov 26</div>
      <div className="space-y-1.5 mb-4">
        {arrivals.map(a => (
          <div key={a.city} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2">
            <span className={`text-xs font-bold ${a.color}`}>{a.city}</span>
            <span className="text-[10px] text-zinc-500">{a.flight}</span>
            <span className="text-[10px] text-zinc-400">{a.arrives}</span>
          </div>
        ))}
      </div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Departures Dec 2</div>
      <div className="space-y-1.5">
        {departures.map(a => (
          <div key={a.city} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2">
            <span className={`text-xs font-bold ${a.color}`}>{a.city}</span>
            <span className="text-[10px] text-zinc-500">{a.departs}</span>
            <span className="text-[10px] text-zinc-400">{a.arrives}</span>
          </div>
        ))}
      </div>
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
      <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-emerald-950/50 to-transparent" />
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl shadow-black/40">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 text-6xl">🌌</div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-emerald-400">Private Trip App</p>
          <h1 className="text-3xl font-bold text-white">Alaska 2026</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">13 friends · Nov 26 – Dec 2 · Anchorage · Healy · Fairbanks</p>
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
            <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">Ice caves</span>
            <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">Dog sleds</span>
            <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">Chena hot springs</span>
            <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">Northern lights</span>
          </div>
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
            Unlock itinerary ✈️
          </button>
        </form>
        <p className="mt-5 text-center text-xs leading-relaxed text-zinc-600">Share this link + password with your travel group only.</p>
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
      <div className="pointer-events-none fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-emerald-950/40 to-transparent" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">

        <header className="sticky top-0 z-20 -mx-3 mb-5 border-b border-zinc-800/80 bg-zinc-950/95 px-3 pb-4 pt-3 backdrop-blur sm:static sm:mx-0 sm:mb-8 sm:bg-transparent sm:px-0 sm:pb-8 sm:pt-0">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-emerald-400">Alaska Winter Adventure · 2026</p>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">Nov 26 – Dec 2, 2026</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                13 friends · Anchorage · Healy · Fairbanks · ice caves · dog sleds · Chena hot springs · 4 aurora nights
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
          <div className="mb-5 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
            <p className="mb-2 font-semibold">Data issues:</p>
            <ul className="list-inside list-disc space-y-1">{dataErrors.map(e => <li key={e}>{e}</li>)}</ul>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={current.day} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.18 }}
            className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">

            {/* Main card */}
            <div className="space-y-4">
              {/* Wake up banner */}
              <WakeUpBanner day={current} />

              {/* Alerts */}
              {current.alerts?.length > 0 && (
                <div className="rounded-2xl border border-amber-500/25 bg-amber-500/8 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold text-amber-300"><Icon name="alert" /> Today's alerts</div>
                  <div className="flex flex-wrap gap-2">
                    {current.alerts.map(a => (
                      <span key={a} className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-100">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Day card */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-2xl shadow-black/30 overflow-hidden">
                <div className="border-b border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 sm:p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                    <span className="rounded-full bg-zinc-800 px-3 py-1">{current.date}</span>
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-300">Day {current.day} of 7</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white sm:text-3xl">{current.title}</h2>
                  <p className="mt-1 text-xs text-zinc-500">{current.drive}</p>
                  <DaySwitcher active={active} setActive={setActive} compact />
                </div>

                <div className="p-4 sm:p-5">
                  <div className="space-y-3">
                    {current.activities.map((act, i) => {
                      const booking = findBooking(current, act);
                      return (
                        <div key={`${act.time}-${i}`}
                          className={`rounded-xl border p-4 ${act.optional ? "border-zinc-800/50 bg-zinc-950/20" : "border-zinc-800 bg-zinc-950/50"}`}>
                          <div className="sm:grid sm:grid-cols-[120px_1fr] sm:gap-4">
                            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-300 sm:mb-0 sm:mt-0.5">
                              <Icon name="clock" />
                              <span>{act.time}</span>
                            </div>
                            <div>
                              <div className="mb-2 flex flex-wrap items-center gap-1.5 text-xs text-zinc-500">
                                <Icon name={act.icon} />
                                <span>{act.type}</span>
                                {act.optional && <span className="rounded-full bg-zinc-800 px-2 py-0.5 font-semibold text-zinc-400">optional</span>}
                                {act.badge && <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-semibold text-emerald-300">{act.badge}</span>}
                                {booking && <span className="rounded-full bg-sky-500/15 px-2 py-0.5 font-semibold text-sky-300"><Icon name="ticket" /> booked</span>}
                                {act.alert && <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-semibold text-amber-200"><Icon name="alert" /> {act.alert}</span>}
                                {act.photo && <span className="rounded-full bg-violet-500/15 px-2 py-0.5 font-semibold text-violet-200"><Icon name="camera" /> {act.photo}</span>}
                              </div>
                              <p className={`text-sm leading-relaxed ${act.optional ? "text-zinc-400" : "text-zinc-100"}`}>{act.text}</p>
                              {booking && (
                                <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/8 p-3">
                                  <div className="font-semibold text-emerald-100 text-xs">{booking.name}</div>
                                  {booking.confirmation && <div className="mt-1 text-xs text-emerald-200/80">Confirmation: {booking.confirmation}</div>}
                                  {booking.meetingPoint && <div className="mt-1 text-xs text-emerald-200/80">📍 {booking.meetingPoint}</div>}
                                </div>
                              )}
                              <div className="mt-3 flex flex-wrap gap-2">
                                {act.destination && <NavBtn href={navLink(act.destination)}>Navigate <Icon name="external" /></NavBtn>}
                                {booking?.link && <NavBtn href={booking.link}>Booking <Icon name="external" /></NavBtn>}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-4">
              {/* Stay info */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5">
                <div className="mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500">Tonight's stay</div>
                <div className="font-semibold text-white text-sm">{current.stay}</div>
                <div className="text-xs text-zinc-400 mt-1">{current.stayAddress}</div>
                <div className="border-t border-zinc-800 mt-4 pt-4 mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500">Route</div>
                <p className="text-xs text-zinc-400">{current.drive}</p>
                <div className="mt-4">
                  <NavBtn href={current.map} primary>Open Google Maps <Icon name="external" /></NavBtn>
                </div>
              </div>

              <ClothingPanel day={current} />
              <BookingPanel day={current} />
              <AuroraBar activeDay={active + 1} />
              <GroupFlights />

              {/* Legend */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5">
                <h3 className="mb-3 text-sm font-bold text-white">Legend</h3>
                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                  <span className="flex items-center gap-2"><Icon name="mountain" /> Natural wonder</span>
                  <span className="flex items-center gap-2"><Icon name="snowflake" /> Ice / glacier</span>
                  <span className="flex items-center gap-2"><Icon name="stars" /> Aurora</span>
                  <span className="flex items-center gap-2"><Icon name="paw" /> Wildlife / sleds</span>
                  <span className="flex items-center gap-2"><Icon name="alert" /> Alert</span>
                  <span className="flex items-center gap-2"><Icon name="ticket" /> Booking</span>
                  <span className="flex items-center gap-2"><Icon name="camera" /> Photo spot</span>
                  <span className="flex items-center gap-2 text-zinc-600">dim = optional</span>
                </div>
              </div>
            </aside>
          </motion.div>
        </AnimatePresence>

        <footer className="mt-8 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-4 text-xs leading-relaxed text-zinc-600">
          <span className="font-semibold text-zinc-400">Full route: </span>{routeSummary}
        </footer>
      </div>
    </div>
  );
}

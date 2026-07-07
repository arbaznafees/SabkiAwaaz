"""
Seed script — populates the database with:
  • 5 wards of demand_data for the "Janpath Nagar" constituency
  • 70 realistic Hindi-English citizen submissions across 7 themes
  • Runs Gemini embedding + concern extraction for each (rate-limited)
  • Triggers clustering and ranking

Usage:
    cd backend
    python seed.py

Requires: GEMINI_API_KEY and DATABASE_URL env vars (or .env file).
"""

import time
import sys

from config import settings  # noqa — validates env vars early
from database import init_db, SessionLocal
from models import Submission, DemandData
from services import gemini_service
from services.clustering import run_clustering
from services.ranking import compute_rankings

CONSTITUENCY = settings.DEFAULT_CONSTITUENCY

# ── Ward demand data ────────────────────────────────────────────────────

WARDS = [
    {"ward": "Laxmi Nagar",      "population": 45000, "school_enrollment": 3200, "infra_gap_score": 0.72, "source": "data.gov.in"},
    {"ward": "Nehru Colony",     "population": 38000, "school_enrollment": 2800, "infra_gap_score": 0.65, "source": "data.gov.in"},
    {"ward": "Gandhi Chowk",     "population": 52000, "school_enrollment": 4100, "infra_gap_score": 0.81, "source": "data.gov.in"},
    {"ward": "Ambedkar Ward",    "population": 41000, "school_enrollment": 3500, "infra_gap_score": 0.78, "source": "data.gov.in"},
    {"ward": "Subhash Mohalla",  "population": 33000, "school_enrollment": 2200, "infra_gap_score": 0.59, "source": "data.gov.in"},
]

# ── 70 synthetic citizen submissions ────────────────────────────────────
# Each tuple: (ward, raw_text)
# Themes: school infrastructure, water supply, road repair, streetlight
#          outages, health center staffing, drainage/sewage, public transport

SEED_SUBMISSIONS = [
    # ── School Infrastructure (10) ──
    ("Laxmi Nagar",     "School ki building bahut purani ho gayi hai, ceiling se plaster gir raha hai"),
    ("Nehru Colony",    "Hamare government school mein toilet broken hai 6 mahine se"),
    ("Gandhi Chowk",    "Primary school mein 200 bacche hain lekin sirf 3 classroom"),
    ("Ambedkar Ward",   "School ki boundary wall toot gayi hai, bacche road pe nikal jaate hain"),
    ("Subhash Mohalla", "Computer lab mein ek bhi computer kaam nahi karta"),
    ("Laxmi Nagar",     "School mein peeney ka paani nahi aata, bacche ghar se bottle laate hain"),
    ("Nehru Colony",    "Roof leaking in monsoon, classes have to be cancelled every year"),
    ("Gandhi Chowk",    "No blackboards in 2 classrooms, teachers use the walls to write"),
    ("Ambedkar Ward",   "School playground pe kachra dump hota hai, bacche khelne nahi paa rahe"),
    ("Subhash Mohalla", "Mid day meal ki quality bahut kharab hai, bacche nahi khaate"),

    # ── Water Supply (10) ──
    ("Laxmi Nagar",     "Paani sirf subah 1 ghanta aata hai, poora din koi supply nahi hoti"),
    ("Nehru Colony",    "Water tanker hafta mein sirf 2 baar aata hai, kaafi nahi hai"),
    ("Gandhi Chowk",    "Pipeline leak hai 2 mahine se, paani road pe beh raha hai"),
    ("Ambedkar Ward",   "Boring ka paani peela aata hai, peene layak nahi hai"),
    ("Subhash Mohalla", "Colony mein naya connection lene ke liye 6 mahine se wait kar rahe hain"),
    ("Laxmi Nagar",     "Water pressure bahut low hai, 3rd floor pe paani hi nahi aata"),
    ("Nehru Colony",    "Summer mein paani ki tanker pe ladhai hoti hai, mahilaon ko bahut problem"),
    ("Gandhi Chowk",    "Municipality pump kharab hai 3 hafte se, koi repair nahi aaya"),
    ("Ambedkar Ward",   "Contaminated water supply causing stomach problems in children"),
    ("Subhash Mohalla", "Hand pump dry ho gaya hai, nearest water source 1 km door hai"),

    # ── Road Repair (10) ──
    ("Laxmi Nagar",     "Main road pe gaddhe hain itne bade ki accident ho rahe hain"),
    ("Nehru Colony",    "Baarish mein road pe itna paani bharta hai ki rickshaw bhi nahi chal paata"),
    ("Gandhi Chowk",    "Gali number 4 ki road 5 saal se nahi bani, kaccha raasta hai"),
    ("Ambedkar Ward",   "Newly built road already broken after one monsoon season"),
    ("Subhash Mohalla", "Speed breaker itna uncha hai ki ambulance slow ho jaati hai"),
    ("Laxmi Nagar",     "Road widening ka kaam beech mein chhod diya, half road khoda hua hai"),
    ("Nehru Colony",    "Manhole cover missing hai main road pe, raat ko log gir jaate hain"),
    ("Gandhi Chowk",    "School ke saamne ki road pe koi zebra crossing nahi hai"),
    ("Ambedkar Ward",   "Truck route residential area se jaata hai, road toot gayi hai"),
    ("Subhash Mohalla", "Footpath tuta hua hai, pedestrians ko road pe chalna padta hai"),

    # ── Streetlight Outages (10) ──
    ("Laxmi Nagar",     "Poori gali mein ek bhi streetlight kaam nahi kar rahi 2 mahine se"),
    ("Nehru Colony",    "Park ke paas andhera rehta hai raat ko, mahilaon ko dar lagta hai"),
    ("Gandhi Chowk",    "Street light complaint karne ke baad bhi 3 mahine se koi action nahi"),
    ("Ambedkar Ward",   "Naye mohalle mein streetlight lagayi hi nahi gayi abhi tak"),
    ("Subhash Mohalla", "Bijli ke pole jhuk gaye hain, khatarnak hai baarish mein"),
    ("Laxmi Nagar",     "LED lights lagai thi lekin 3 mahine mein sab fuse ho gayi"),
    ("Nehru Colony",    "Raat ko main road pe andhera rehta hai, accidents ho rahe hain"),
    ("Gandhi Chowk",    "Streetlights din mein jalti hain aur raat ko band rehti hain"),
    ("Ambedkar Ward",   "Only 2 lights working out of 15 in our lane, very dark at night"),
    ("Subhash Mohalla", "No lights near the temple area, elderly people fall at night"),

    # ── Health Center Staffing (10) ──
    ("Laxmi Nagar",     "PHC mein doctor subah 2 ghante aata hai, baaki time taala laga rehta hai"),
    ("Nehru Colony",    "Health center mein ek bhi nurse nahi hai, delivery ke liye bahar jaana padta hai"),
    ("Gandhi Chowk",    "Pregnant women ko 15 km door jaana padta hai delivery ke liye"),
    ("Ambedkar Ward",   "Dawai ki supply 2 mahine se nahi aayi dispensary mein"),
    ("Subhash Mohalla", "Child vaccination drive cancel ho gayi kyunki staff nahi tha"),
    ("Laxmi Nagar",     "PHC mein ambulance hai lekin driver nahi hai, emergency mein dikkat"),
    ("Nehru Colony",    "Blood test ke liye district hospital jaana padta hai, local mein facility nahi"),
    ("Gandhi Chowk",    "Night emergency mein koi doctor available nahi hota hamare area mein"),
    ("Ambedkar Ward",   "Malaria outbreak hua lekin fogging team 2 hafte baad aayi"),
    ("Subhash Mohalla", "Only one doctor for 20000 population in our area, always overcrowded"),

    # ── Drainage / Sewage (10) ──
    ("Laxmi Nagar",     "Naali band hai, gandi paani road pe aa raha hai hamare ghar ke saamne"),
    ("Nehru Colony",    "Sewage overflow ho raha hai ghar ke saamne, badboo aati hai poora din"),
    ("Gandhi Chowk",    "Baarish mein ghar mein paani ghus aata hai kyunki drainage nahi hai"),
    ("Ambedkar Ward",   "Open drain ke paas mosquito breeding ho rahi hai, dengue ka dar hai"),
    ("Subhash Mohalla", "Drainage system 20 saal purana hai, ab capacity nahi hai"),
    ("Laxmi Nagar",     "Naali safai ka kaam 6 mahine se nahi hua, bahut gandgi hai"),
    ("Nehru Colony",    "Sewage water mixing with drinking water pipeline in our colony"),
    ("Gandhi Chowk",    "Kids play near open drains, very dangerous, no railing or cover"),
    ("Ambedkar Ward",   "Naya construction hua lekin drainage plan nahi bana, paani bharta hai"),
    ("Subhash Mohalla", "Manhole overflow during every rain, dirty water enters houses"),

    # ── Public Transport (10) ──
    ("Laxmi Nagar",     "Bus stop hai lekin bus nahi aati, auto maangta hai double kiraya"),
    ("Nehru Colony",    "Nearest bus route 2 km door hai, budhhe log chal nahi paate"),
    ("Gandhi Chowk",    "Bus sirf 3 baar aati hai din mein, timing fix nahi hai"),
    ("Ambedkar Ward",   "Auto drivers meter se nahi chalte, zyada paisa maangte hain hamesha"),
    ("Subhash Mohalla", "School bus service band ho gayi, bacche paidal jaate hain 3 km"),
    ("Laxmi Nagar",     "Bus stop pe shade nahi hai, dhoop aur baarish mein khade rehna padta hai"),
    ("Nehru Colony",    "E-rickshaw ne traffic jam kar diya hai par regular transport nahi hai"),
    ("Gandhi Chowk",    "Last bus 7 pm ko hai, working women ko problem hoti hai raat ko"),
    ("Ambedkar Ward",   "No direct bus to district hospital, 2 bus change karni padti hai"),
    ("Subhash Mohalla", "Road itni kharab hai ki bus wale humara route skip kar dete hain"),
]

def seed():
    """Run the full seeding pipeline."""
    init_db()
    db = SessionLocal()

    try:
        # ── 1. Seed demand data ─────────────────────────────────────────
        print("\n📊 Seeding demand data for 5 wards...")
        for w in WARDS:
            row = DemandData(**w)
            db.merge(row)
        db.commit()
        print(f"   ✅ {len(WARDS)} ward demand records upserted.")

        # ── 2. Seed submissions ─────────────────────────────────────────
        total = len(SEED_SUBMISSIONS)
        print(f"\n📝 Seeding {total} citizen submissions...")
        print("   (Each requires 2 Gemini API calls — concern extraction + embedding)")
        print("   This will take a few minutes with rate-limiting delays.\n")

        success_count = 0
        fail_count = 0

        for i, (ward, raw_text) in enumerate(SEED_SUBMISSIONS):
            progress = f"[{i + 1}/{total}]"
            try:
                # Extract concern via Gemini
                extracted_concern = gemini_service.extract_concern(raw_text)
                time.sleep(4.5)  # rate-limit pause between calls

                # Generate embedding via Gemini
                embedding = gemini_service.generate_embedding(extracted_concern)
                time.sleep(0.3)  # rate-limit pause

                submission = Submission(
                    raw_input_type="text",
                    raw_text=raw_text,
                    extracted_concern=extracted_concern,
                    ward=ward,
                    constituency=CONSTITUENCY,
                    embedding=embedding,
                    language="hi-en",
                )
                db.add(submission)
                db.commit()
                success_count += 1
                print(f"   {progress} ✅ {ward}: {extracted_concern[:60]}...")

            except Exception as e:
                fail_count += 1
                print(f"   {progress} ❌ FAILED ({ward}): {e}")
                db.rollback()
                # Longer pause on failure (likely rate limit)
                time.sleep(2.0)
                continue

        print(f"\n   Seeding complete: {success_count} succeeded, {fail_count} failed.")

        # ── 3. Run clustering ───────────────────────────────────────────
        print("\n🔗 Running clustering on seeded submissions...")
        cluster_summary = run_clustering(db, CONSTITUENCY)
        print(f"   Clusters formed:        {cluster_summary['clusters_formed']}")
        print(f"   Submissions clustered:  {cluster_summary['submissions_clustered']}")
        print(f"   Noise (unclustered):    {cluster_summary['noise_submissions']}")

        # ── 4. Run ranking ──────────────────────────────────────────────
        print("\n📈 Computing priority rankings...")
        rank_summary = compute_rankings(db, CONSTITUENCY)
        print(f"   Rankings written:  {rank_summary['rankings_written']}")
        print(f"   Clusters ranked:   {rank_summary['clusters_ranked']}")

        print("\n🎉 Seed complete! Start the backend with:")
        print("   uvicorn main:app --reload")

    finally:
        db.close()


if __name__ == "__main__":
    seed()

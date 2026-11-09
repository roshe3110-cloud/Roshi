import { FormField } from "@/components/common/form";

/**
 * NOTE ON POSTAL CODES:
 * Postal codes below are the GPO (General Post Office) / main city code only.
 * Pakistan Post assigns different codes to individual localities, cantonments,
 * and sub-post offices within the same city, so a single code per city is an
 * approximation and should NOT be relied on for automatic/authoritative
 * postal-code lookups. Before using these for shipping/billing automation,
 * verify against the official Pakistan Post postal code directory:
 * https://www.pakpost.gov.pk/
 *
 * NOTE ON "PROVINCE" FIELD:
 * Islamabad (IS) is the Islamabad Capital Territory, not a province.
 * Gilgit-Baltistan (GB) and Azad Jammu & Kashmir (JK) are also not provinces
 * in the constitutional sense (they are administrative territories).
 * The field is kept as `province` for form/schema simplicity, but the
 * `provinceOptions` labels reflect the correct administrative type.
 */

const pakistanCities = [
  // ---------------- Punjab (PB) ----------------
  { label: "Lahore", value: "lahore", province: "PB", postalCode: "54000" },
  {
    label: "Rawalpindi",
    value: "rawalpindi",
    province: "PB",
    postalCode: "46000",
  },
  {
    label: "Faisalabad",
    value: "faisalabad",
    province: "PB",
    postalCode: "38000",
  },
  { label: "Multan", value: "multan", province: "PB", postalCode: "60000" },
  {
    label: "Gujranwala",
    value: "gujranwala",
    province: "PB",
    postalCode: "52250",
  },
  { label: "Sialkot", value: "sialkot", province: "PB", postalCode: "51310" },
  {
    label: "Bahawalpur",
    value: "bahawalpur",
    province: "PB",
    postalCode: "63100",
  },
  { label: "Sargodha", value: "sargodha", province: "PB", postalCode: "40100" },
  {
    label: "Sheikhupura",
    value: "sheikhupura",
    province: "PB",
    postalCode: "39350",
  },
  { label: "Jhang", value: "jhang", province: "PB", postalCode: "35200" },
  {
    label: "Rahim Yar Khan",
    value: "rahim_yar_khan",
    province: "PB",
    postalCode: "64200",
  },
  { label: "Gujrat", value: "gujrat", province: "PB", postalCode: "50700" },
  { label: "Kasur", value: "kasur", province: "PB", postalCode: "55050" },
  { label: "Okara", value: "okara", province: "PB", postalCode: "56300" },
  { label: "Sahiwal", value: "sahiwal", province: "PB", postalCode: "57000" },
  {
    label: "Dera Ghazi Khan",
    value: "dera_ghazi_khan",
    province: "PB",
    postalCode: "32200",
  },
  { label: "Chiniot", value: "chiniot", province: "PB", postalCode: "35400" },
  { label: "Jhelum", value: "jhelum", province: "PB", postalCode: "49600" },
  {
    label: "Bahawalnagar",
    value: "bahawalnagar",
    province: "PB",
    postalCode: "62300",
  },
  { label: "Vehari", value: "vehari", province: "PB", postalCode: "61100" },
  {
    label: "Wazirabad",
    value: "wazirabad",
    province: "PB",
    postalCode: "52000",
  },
  { label: "Mianwali", value: "mianwali", province: "PB", postalCode: "42200" },
  {
    label: "Muzaffargarh",
    value: "muzaffargarh",
    province: "PB",
    postalCode: "34200",
  },
  { label: "Khanewal", value: "khanewal", province: "PB", postalCode: "58150" },
  {
    label: "Toba Tek Singh",
    value: "toba_tek_singh",
    province: "PB",
    postalCode: "36050",
  },
  { label: "Attock", value: "attock", province: "PB", postalCode: "43600" },
  {
    label: "Nankana Sahib",
    value: "nankana_sahib",
    province: "PB",
    postalCode: "39100",
  },
  {
    label: "Hafizabad",
    value: "hafizabad",
    province: "PB",
    postalCode: "51000",
  },
  {
    label: "Mandi Bahauddin",
    value: "mandi_bahauddin",
    province: "PB",
    postalCode: "50400",
  },
  { label: "Narowal", value: "narowal", province: "PB", postalCode: "51600" },
  { label: "Lodhran", value: "lodhran", province: "PB", postalCode: "59320" },
  {
    label: "Pakpattan",
    value: "pakpattan",
    province: "PB",
    postalCode: "57400",
  },
  { label: "Bhakkar", value: "bhakkar", province: "PB", postalCode: "30000" },
  { label: "Layyah", value: "layyah", province: "PB", postalCode: "31200" },
  { label: "Rajanpur", value: "rajanpur", province: "PB", postalCode: "32900" },
  { label: "Chakwal", value: "chakwal", province: "PB", postalCode: "48800" },
  { label: "Talagang", value: "talagang", province: "PB", postalCode: "48090" },
  { label: "Murree", value: "murree", province: "PB", postalCode: "47150" },
  { label: "Taxila", value: "taxila", province: "PB", postalCode: "47080" },
  {
    label: "Wah Cantonment",
    value: "wah_cantt",
    province: "PB",
    postalCode: "47040",
  },
  { label: "Kamoke", value: "kamoke", province: "PB", postalCode: "52470" },
  { label: "Kamalia", value: "kamalia", province: "PB", postalCode: "36450" },
  { label: "Kot Addu", value: "kot_addu", province: "PB", postalCode: "34310" },
  {
    label: "Mian Channu",
    value: "mian_channu",
    province: "PB",
    postalCode: "58150",
  },
  {
    label: "Chishtian",
    value: "chishtian",
    province: "PB",
    postalCode: "62200",
  },
  { label: "Daska", value: "daska", province: "PB", postalCode: "51010" },
  { label: "Pattoki", value: "pattoki", province: "PB", postalCode: "55240" },
  { label: "Chunian", value: "chunian", province: "PB", postalCode: "55110" },
  {
    label: "Ferozewala",
    value: "ferozewala",
    province: "PB",
    postalCode: "39350",
  },
  {
    label: "Jaranwala",
    value: "jaranwala",
    province: "PB",
    postalCode: "37500",
  },
  { label: "Samundri", value: "samundri", province: "PB", postalCode: "37800" },
  {
    label: "Chichawatni",
    value: "chichawatni",
    province: "PB",
    postalCode: "57200",
  },
  {
    label: "Ahmedpur East",
    value: "ahmedpur_east",
    province: "PB",
    postalCode: "63350",
  },
  { label: "Khanpur", value: "khanpur", province: "PB", postalCode: "64100" },
  {
    label: "Kabirwala",
    value: "kabirwala",
    province: "PB",
    postalCode: "60350",
  },
  { label: "Shorkot", value: "shorkot", province: "PB", postalCode: "35340" },
  {
    label: "Jauharabad (Khushab)",
    value: "jauharabad",
    province: "PB",
    postalCode: "41200",
  },
  {
    label: "Fateh Jang",
    value: "fateh_jang",
    province: "PB",
    postalCode: "43350",
  },
  {
    label: "Gujar Khan",
    value: "gujar_khan",
    province: "PB",
    postalCode: "47800",
  },
  { label: "Kharian", value: "kharian", province: "PB", postalCode: "50090" },
  { label: "Phalia", value: "phalia", province: "PB", postalCode: "50350" },
  {
    label: "Kot Radha Kishan",
    value: "kot_radha_kishan",
    province: "PB",
    postalCode: "55070",
  },

  // ---------------- Sindh (SD) ----------------
  { label: "Karachi", value: "karachi", province: "SD", postalCode: "74000" },
  {
    label: "Hyderabad",
    value: "hyderabad",
    province: "SD",
    postalCode: "71000",
  },
  { label: "Sukkur", value: "sukkur", province: "SD", postalCode: "65200" },
  { label: "Larkana", value: "larkana", province: "SD", postalCode: "77150" },
  {
    label: "Nawabshah",
    value: "nawabshah",
    province: "SD",
    postalCode: "67450",
  },
  {
    label: "Mirpurkhas",
    value: "mirpurkhas",
    province: "SD",
    postalCode: "69000",
  },
  {
    label: "Jacobabad",
    value: "jacobabad",
    province: "SD",
    postalCode: "79200",
  },
  {
    label: "Shikarpur",
    value: "shikarpur",
    province: "SD",
    postalCode: "78000",
  },
  { label: "Khairpur", value: "khairpur", province: "SD", postalCode: "66020" },
  { label: "Dadu", value: "dadu", province: "SD", postalCode: "76900" },
  { label: "Thatta", value: "thatta", province: "SD", postalCode: "75150" },
  { label: "Badin", value: "badin", province: "SD", postalCode: "72200" },
  { label: "Kotri", value: "kotri", province: "SD", postalCode: "76320" },
  {
    label: "Tando Adam",
    value: "tando_adam",
    province: "SD",
    postalCode: "70150",
  },
  {
    label: "Tando Allahyar",
    value: "tando_allahyar",
    province: "SD",
    postalCode: "70200",
  },
  {
    label: "Tando Muhammad Khan",
    value: "tando_muhammad_khan",
    province: "SD",
    postalCode: "70400",
  },
  { label: "Moro", value: "moro", province: "SD", postalCode: "67200" },
  {
    label: "Naushahro Feroze",
    value: "naushahro_feroze",
    province: "SD",
    postalCode: "67000",
  },
  { label: "Sanghar", value: "sanghar", province: "SD", postalCode: "68100" },
  { label: "Umerkot", value: "umerkot", province: "SD", postalCode: "69000" },
  { label: "Ghotki", value: "ghotki", province: "SD", postalCode: "65600" },
  { label: "Daharki", value: "daharki", province: "SD", postalCode: "65650" },
  {
    label: "Shahdadkot",
    value: "shahdadkot",
    province: "SD",
    postalCode: "77400",
  },
  { label: "Ranipur", value: "ranipur", province: "SD", postalCode: "66700" },
  { label: "Matiari", value: "matiari", province: "SD", postalCode: "70600" },
  { label: "Kandhkot", value: "kandhkot", province: "SD", postalCode: "79300" },
  { label: "Rohri", value: "rohri", province: "SD", postalCode: "65400" },
  {
    label: "Pano Aqil",
    value: "pano_aqil",
    province: "SD",
    postalCode: "65120",
  },
  { label: "Sehwan", value: "sehwan", province: "SD", postalCode: "76500" },
  { label: "Mehar", value: "mehar", province: "SD", postalCode: "77500" },
  { label: "Jamshoro", value: "jamshoro", province: "SD", postalCode: "76060" },

  // ---------------- Khyber Pakhtunkhwa (KP) ----------------
  { label: "Peshawar", value: "peshawar", province: "KP", postalCode: "25000" },
  { label: "Mardan", value: "mardan", province: "KP", postalCode: "23200" },
  {
    label: "Abbottabad",
    value: "abbottabad",
    province: "KP",
    postalCode: "22010",
  },
  {
    label: "Mingora (Swat)",
    value: "mingora",
    province: "KP",
    postalCode: "19130",
  },
  { label: "Kohat", value: "kohat", province: "KP", postalCode: "26000" },
  { label: "Bannu", value: "bannu", province: "KP", postalCode: "28100" },
  {
    label: "Dera Ismail Khan",
    value: "dera_ismail_khan",
    province: "KP",
    postalCode: "29050",
  },
  {
    label: "Charsadda",
    value: "charsadda",
    province: "KP",
    postalCode: "24420",
  },
  { label: "Nowshera", value: "nowshera", province: "KP", postalCode: "24100" },
  { label: "Swabi", value: "swabi", province: "KP", postalCode: "23430" },
  { label: "Mansehra", value: "mansehra", province: "KP", postalCode: "21300" },
  { label: "Haripur", value: "haripur", province: "KP", postalCode: "22620" },
  { label: "Chitral", value: "chitral", province: "KP", postalCode: "17200" },
  { label: "Dir", value: "dir", province: "KP", postalCode: "18400" },
  {
    label: "Timergara",
    value: "timergara",
    province: "KP",
    postalCode: "18300",
  },
  { label: "Batkhela", value: "batkhela", province: "KP", postalCode: "24350" },
  { label: "Kabal", value: "kabal", province: "KP", postalCode: "19040" },
  { label: "Hangu", value: "hangu", province: "KP", postalCode: "26300" },
  { label: "Karak", value: "karak", province: "KP", postalCode: "27200" },
  {
    label: "Lakki Marwat",
    value: "lakki_marwat",
    province: "KP",
    postalCode: "28400",
  },
  { label: "Tank", value: "tank", province: "KP", postalCode: "29020" },
  {
    label: "Daggar (Buner)",
    value: "daggar",
    province: "KP",
    postalCode: "19230",
  },
  {
    label: "Parachinar",
    value: "parachinar",
    province: "KP",
    postalCode: "26100",
  },
  {
    label: "Bajaur (Khar)",
    value: "khar_bajaur",
    province: "KP",
    postalCode: "19400",
  },
  {
    label: "Mohmand (Ghalanai)",
    value: "ghalanai_mohmand",
    province: "KP",
    postalCode: "24730",
  },
  {
    label: "Wana (South Waziristan)",
    value: "wana",
    province: "KP",
    postalCode: "29220",
  },
  {
    label: "Miranshah (North Waziristan)",
    value: "miranshah",
    province: "KP",
    postalCode: "28150",
  },
  { label: "Batagram", value: "batagram", province: "KP", postalCode: "21310" },
  {
    label: "Shangla (Alpuri)",
    value: "alpuri",
    province: "KP",
    postalCode: "19650",
  },
  { label: "Topi", value: "topi", province: "KP", postalCode: "23640" },
  { label: "Risalpur", value: "risalpur", province: "KP", postalCode: "24080" },
  { label: "Paharpur", value: "paharpur", province: "KP", postalCode: "29380" },

  // ---------------- Balochistan (BA) ----------------
  { label: "Quetta", value: "quetta", province: "BA", postalCode: "87300" },
  { label: "Gwadar", value: "gwadar", province: "BA", postalCode: "91200" },
  { label: "Turbat", value: "turbat", province: "BA", postalCode: "92600" },
  { label: "Khuzdar", value: "khuzdar", province: "BA", postalCode: "89100" },
  { label: "Sibi", value: "sibi", province: "BA", postalCode: "89200" },
  { label: "Chaman", value: "chaman", province: "BA", postalCode: "86700" },
  { label: "Zhob", value: "zhob", province: "BA", postalCode: "85200" },
  { label: "Loralai", value: "loralai", province: "BA", postalCode: "84200" },
  {
    label: "Dera Murad Jamali (Nasirabad)",
    value: "dera_murad_jamali",
    province: "BA",
    postalCode: "89400",
  },
  {
    label: "Dera Allah Yar (Jaffarabad)",
    value: "dera_allah_yar",
    province: "BA",
    postalCode: "89320",
  },
  { label: "Kalat", value: "kalat", province: "BA", postalCode: "88100" },
  { label: "Mastung", value: "mastung", province: "BA", postalCode: "87700" },
  { label: "Panjgur", value: "panjgur", province: "BA", postalCode: "92700" },
  { label: "Pasni", value: "pasni", province: "BA", postalCode: "91700" },
  { label: "Ormara", value: "ormara", province: "BA", postalCode: "91800" },
  { label: "Nushki", value: "nushki", province: "BA", postalCode: "87500" },
  { label: "Kharan", value: "kharan", province: "BA", postalCode: "88800" },
  {
    label: "Usta Muhammad",
    value: "usta_muhammad",
    province: "BA",
    postalCode: "89310",
  },
  { label: "Barkhan", value: "barkhan", province: "BA", postalCode: "84410" },
  {
    label: "Dalbandin (Chagai)",
    value: "dalbandin",
    province: "BA",
    postalCode: "87900",
  },
  { label: "Musakhel", value: "musakhel", province: "BA", postalCode: "84500" },
  {
    label: "Sohbatpur",
    value: "sohbatpur",
    province: "BA",
    postalCode: "89450",
  },
  { label: "Harnai", value: "harnai", province: "BA", postalCode: "89550" },
  { label: "Ziarat", value: "ziarat", province: "BA", postalCode: "89950" },
  {
    label: "Lasbela (Uthal)",
    value: "uthal",
    province: "BA",
    postalCode: "90150",
  },
  { label: "Hub", value: "hub", province: "BA", postalCode: "90040" },
  { label: "Awaran", value: "awaran", province: "BA", postalCode: "92200" },
  { label: "Duki", value: "duki", province: "BA", postalCode: "84300" },
  { label: "Kohlu", value: "kohlu", province: "BA", postalCode: "83800" },
  {
    label: "Dera Bugti",
    value: "dera_bugti",
    province: "BA",
    postalCode: "83900",
  },

  // ---------------- Islamabad Capital Territory (IS) ----------------
  {
    label: "Islamabad",
    value: "islamabad",
    province: "IS",
    postalCode: "44000",
  },

  // ---------------- Gilgit-Baltistan (GB) ----------------
  { label: "Gilgit", value: "gilgit", province: "GB", postalCode: "15100" },
  { label: "Skardu", value: "skardu", province: "GB", postalCode: "16100" },
  {
    label: "Hunza (Karimabad)",
    value: "hunza",
    province: "GB",
    postalCode: "15104",
  },
  {
    label: "Ghanche (Khaplu)",
    value: "khaplu",
    province: "GB",
    postalCode: "16200",
  },
  {
    label: "Ghizer (Gahkuch)",
    value: "gahkuch",
    province: "GB",
    postalCode: "15200",
  },
  { label: "Astore", value: "astore", province: "GB", postalCode: "16400" },
  {
    label: "Diamer (Chilas)",
    value: "chilas",
    province: "GB",
    postalCode: "15300",
  },
  { label: "Nagar", value: "nagar", province: "GB", postalCode: "15110" },
  { label: "Shigar", value: "shigar", province: "GB", postalCode: "16150" },
  { label: "Kharmang", value: "kharmang", province: "GB", postalCode: "16250" },

  // ---------------- Azad Jammu & Kashmir (JK) ----------------
  {
    label: "Muzaffarabad",
    value: "muzaffarabad",
    province: "JK",
    postalCode: "13100",
  },
  { label: "Mirpur", value: "mirpur", province: "JK", postalCode: "10250" },
  {
    label: "Rawalakot",
    value: "rawalakot",
    province: "JK",
    postalCode: "12100",
  },
  { label: "Kotli", value: "kotli", province: "JK", postalCode: "11100" },
  { label: "Bhimber", value: "bhimber", province: "JK", postalCode: "10040" },
  { label: "Bagh", value: "bagh", province: "JK", postalCode: "12500" },
  {
    label: "Hattian Bala",
    value: "hattian_bala",
    province: "JK",
    postalCode: "13350",
  },
  {
    label: "Neelum (Athmuqam)",
    value: "athmuqam",
    province: "JK",
    postalCode: "13600",
  },
  {
    label: "Sudhnoti (Pallandri)",
    value: "pallandri",
    province: "JK",
    postalCode: "12200",
  },
  {
    label: "Haveli (Forward Kahuta)",
    value: "forward_kahuta",
    province: "JK",
    postalCode: "12550",
  },
];

const provinceOptions = [
  { label: "Punjab", value: "PB" },
  { label: "Sindh", value: "SD" },
  { label: "Khyber Pakhtunkhwa", value: "KP" },
  { label: "Balochistan", value: "BA" },
  { label: "Islamabad Capital Territory", value: "IS" },
  { label: "Gilgit-Baltistan", value: "GB" },
  { label: "Azad Jammu & Kashmir", value: "JK" },
];

const cityOptions = pakistanCities.map(({ label, value }) => ({
  label,
  value,
}));

export const billingFields: FormField[] = [
  {
    name: "billing_first_name",
    label: "First Name",
    type: "text",
    placeholder: "John",
    required: true,
    colSpan: 6,
  },
  {
    name: "billing_last_name",
    label: "Last Name",
    type: "text",
    placeholder: "Doe",
    required: true,
    colSpan: 6,
  },
  {
    name: "billing_company",
    label: "Company",
    type: "text",
    placeholder: "Company (Optional)",
    colSpan: 12,
  },
  {
    name: "billing_country",
    label: "Country / Region",
    type: "select",
    required: true,
    colSpan: 12,
    options: [
      {
        label: "Pakistan",
        value: "PK",
      },
    ],
  },
  {
    name: "billing_address_1",
    label: "Street Address",
    type: "text",
    placeholder: "House Number & Street Name",
    required: true,
    colSpan: 12,
  },
  {
    name: "billing_address_2",
    label: "Apartment / Suite",
    type: "text",
    placeholder: "Apartment, Suite, Unit (Optional)",
    colSpan: 12,
  },

  // City is now a select
  {
    name: "billing_city",
    label: "City",
    type: "select",
    required: true,
    colSpan: 4,
    options: cityOptions,
  },

  {
    name: "billing_state",
    label: "Province",
    type: "select",
    required: true,
    colSpan: 4,
    options: provinceOptions,
  },

  {
    name: "billing_postcode",
    label: "Postal Code",
    type: "text",
    placeholder: "54000",
    required: true,
    colSpan: 4,
  },

  {
    name: "billing_phone",
    label: "Phone",
    type: "tel",
    placeholder: "03XXXXXXXXX",
    required: true,
    colSpan: 6,
  },
  {
    name: "billing_email",
    label: "Email",
    type: "email",
    placeholder: "john@example.com",
    required: true,
    colSpan: 6,
  },
  {
    name: "order_comments",
    label: "Order Notes",
    type: "textarea",
    placeholder: "Notes about your order...",
    colSpan: 12,
  },
];

export const shippingFields: FormField[] = [
  {
    name: "shipping_first_name",
    label: "First Name",
    type: "text",
    colSpan: 6,
  },
  {
    name: "shipping_last_name",
    label: "Last Name",
    type: "text",
    colSpan: 6,
  },
  {
    name: "shipping_company",
    label: "Company",
    type: "text",
    colSpan: 12,
  },
  {
    name: "shipping_country",
    label: "Country",
    type: "select",
    colSpan: 12,
    options: [
      {
        label: "Pakistan",
        value: "PK",
      },
    ],
  },
  {
    name: "shipping_address_1",
    label: "Street Address",
    type: "text",
    colSpan: 12,
  },
  {
    name: "shipping_address_2",
    label: "Apartment",
    type: "text",
    colSpan: 12,
  },

  // City is now a select
  {
    name: "shipping_city",
    label: "City",
    type: "select",
    colSpan: 4,
    options: cityOptions,
  },

  {
    name: "shipping_state",
    label: "Province",
    type: "select",
    colSpan: 4,
    options: provinceOptions,
  },

  {
    name: "shipping_postcode",
    label: "Postal Code",
    type: "text",
    colSpan: 4,
  },
];

export const paymentFields: FormField[] = [
  {
    name: "payment_method",
    label: "Payment Method",
    type: "radio",
    options: [
      {
        label: "Bank Transfer / WhatsApp Slip Verification",
        value: "cod",
      },
    ],
  },
  {
    name: "terms",
    label: "I agree to Terms & Conditions",
    type: "checkbox",
    required: true,
  },
];

export { pakistanCities };

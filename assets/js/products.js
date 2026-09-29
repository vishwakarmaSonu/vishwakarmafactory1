window.VISHWAKARMA_SETTINGS = Object.freeze({
  contactUrl: 'tel:+919588938688',
  whatsappUrl: 'https://wa.me/919588938688?text=Hi%20Vishwakarma%20Art%2C%20I%27d%20like%20to%20know%20more.',
});

const PRODUCT_CATEGORY_CONTENT = Object.freeze({
  mirror: 'A statement piece for bedrooms, dressing areas, and entryways, with a practical design that adds light and character to the room.',
  bookshelves: 'A sturdy display and storage solution for books, decor, and everyday essentials, designed to keep living spaces organised.',
  chair: 'A comfortable handcrafted seating piece with a timeless silhouette, suitable for dining, reading corners, workspaces, or relaxed living.',
  studytables: 'A practical workspace with room for focused study, writing, and storage, made to bring warmth and order to home offices and bedrooms.',
  sideboards: 'A versatile storage cabinet for dining rooms, living rooms, and entryways, combining useful storage with a refined furniture finish.',
  beds: 'A solid bedroom centrepiece designed for everyday comfort, dependable support, and a warm handcrafted look.',
  diningtable: 'A welcoming table for shared meals and conversations, combining a durable build with the natural character of handcrafted furniture.',
  coffeetable: 'A functional centre table that anchors a seating area with useful surface space and a warm, furniture-maker finish.',
  shoeracks: 'A compact entryway organiser that keeps footwear accessible while helping the home stay neat and inviting.',
  woodentemple: 'A devotional home accent with handcrafted wooden detailing, designed to create a calm and respectful prayer space.',
});

function buildProductDescription(product) {
  const safeName = product.name || 'This furniture piece';
  const itemLabel = product.itemId ? `Item ${product.itemId}` : 'This handcrafted piece';
  const categoryCopy = PRODUCT_CATEGORY_CONTENT[product.category] || 'Handcrafted with care to bring lasting utility and warmth to your home.';
  const usage = product.category === 'mirror'
    ? 'for brightening dressing spaces and entryways'
    : product.category === 'bookshelves'
      ? 'for organised storage and display'
      : product.category === 'chair'
        ? 'for relaxed seating and everyday comfort'
        : product.category === 'studytables'
          ? 'for study, writing, and focused work'
          : product.category === 'sideboards'
            ? 'for dining and living room storage'
            : product.category === 'beds'
              ? 'for restful nights and a warm bedroom setting'
              : product.category === 'diningtable'
                ? 'for family meals and shared moments'
                : product.category === 'coffeetable'
                  ? 'for living room styling and everyday use'
                  : product.category === 'shoeracks'
                    ? 'for keeping entryways neat and organised'
                    : 'for devotional, peaceful corners at home';

  return `${safeName} by Vishwakarma Art is a handcrafted ${product.categoryLabel ? product.categoryLabel.toLowerCase() : 'furniture'} piece. ${itemLabel} is designed ${usage} and offers practical comfort with a warm handcrafted finish. ${categoryCopy} Please contact us to confirm exact dimensions, wood finish, and customisation options for the final piece.`;
}

window.VISHWAKARMA_PRODUCTS = Object.freeze(
[
  {
    "id": "1",
    "name": "Mirror",
    "itemId": "105",
    "image": "assets/images/mir.jpg",
    "description": "Size is not decided yet",
    "price": 30999,
    "rating": 4,
    "category": "mirror",
    "categoryLabel": "Mirrors"
  },
  {
    "id": "2",
    "name": "Mirror with Cabinet",
    "itemId": "101",
    "image": "assets/images/mir1.jpg",
    "description": "Size is not decided yet",
    "price": 34999,
    "rating": 4,
    "category": "mirror",
    "categoryLabel": "Mirrors"
  },
  {
    "id": "3",
    "name": "Mirror with Cabinet",
    "itemId": "102",
    "image": "assets/images/mir2.jpg",
    "description": "Size is not decided yet",
    "price": 33999,
    "rating": 5,
    "category": "mirror",
    "categoryLabel": "Mirrors"
  },
  {
    "id": "4",
    "name": "Mirror with Cabinet",
    "itemId": "103",
    "image": "assets/images/mir3.jpg",
    "description": "Size is not decided yet",
    "price": 25999,
    "rating": 4,
    "category": "mirror",
    "categoryLabel": "Mirrors"
  },
  {
    "id": "5",
    "name": "Mirror with Cabinet",
    "itemId": "104",
    "image": "assets/images/mir4.jpg",
    "description": "Size is not decided yet",
    "price": 23999,
    "rating": 4,
    "category": "mirror",
    "categoryLabel": "Mirrors"
  },
  {
    "id": "6",
    "name": "Mirror ",
    "itemId": "106",
    "image": "assets/images/mir5.jpg",
    "description": "Size is not decided yet",
    "price": 31999,
    "rating": 4,
    "category": "mirror",
    "categoryLabel": "Mirrors"
  },
  {
    "id": "7",
    "name": "Mirror with Cabinet",
    "itemId": "107",
    "image": "assets/images/mir6.jpg",
    "description": "Size is not decided yet",
    "price": 32999,
    "rating": 4,
    "category": "mirror",
    "categoryLabel": "Mirrors"
  },
  {
    "id": "8",
    "name": "Mirror with Cabinet",
    "itemId": "108",
    "image": "assets/images/mir7.jpg",
    "description": "Size is not decided yet",
    "price": 37999,
    "rating": 4,
    "category": "mirror",
    "categoryLabel": "Mirrors"
  },
  {
    "id": "9",
    "name": "Bookshelves",
    "itemId": "1113",
    "image": "assets/images/bk.jpg",
    "description": "Size is not decided yet",
    "price": 13999,
    "rating": 4,
    "category": "bookshelves",
    "categoryLabel": "Bookshelves"
  },
  {
    "id": "10",
    "name": "Bookshelves",
    "itemId": "1114",
    "image": "assets/images/bk1.jpg",
    "description": "Size is not decided yet",
    "price": 15999,
    "rating": 4,
    "category": "bookshelves",
    "categoryLabel": "Bookshelves"
  },
  {
    "id": "11",
    "name": "Bookshelves",
    "itemId": "1115",
    "image": "assets/images/bk2.jpg",
    "description": "Size is not decided yet",
    "price": 15039,
    "rating": 4,
    "category": "bookshelves",
    "categoryLabel": "Bookshelves"
  },
  {
    "id": "12",
    "name": "Bookshelves",
    "itemId": "1116",
    "image": "assets/images/bk3.jpg",
    "description": "Size is not decided yet",
    "price": 11999,
    "rating": 4,
    "category": "bookshelves",
    "categoryLabel": "Bookshelves"
  },
  {
    "id": "13",
    "name": "Bookshelves",
    "itemId": "1117",
    "image": "assets/images/bk4.jpg",
    "description": "Size is not decided yet",
    "price": 14999,
    "rating": 4,
    "category": "bookshelves",
    "categoryLabel": "Bookshelves"
  },
  {
    "id": "14",
    "name": "Bookshelves",
    "itemId": "1118",
    "image": "assets/images/bk5.jpg",
    "description": "Size is not decided yet",
    "price": 15999,
    "rating": 4,
    "category": "bookshelves",
    "categoryLabel": "Bookshelves"
  },
  {
    "id": "15",
    "name": "Bookshelves",
    "itemId": "1119",
    "image": "assets/images/bk6.jpg",
    "description": "Size is not decided yet",
    "price": 17999,
    "rating": 4,
    "category": "bookshelves",
    "categoryLabel": "Bookshelves"
  },
  {
    "id": "16",
    "name": "Bookshelves",
    "itemId": "1120",
    "image": "assets/images/bk7.jpg",
    "description": "Size is not decided yet",
    "price": 13999,
    "rating": 4,
    "category": "bookshelves",
    "categoryLabel": "Bookshelves"
  },
  {
    "id": "17",
    "name": "Rocking Chair",
    "itemId": "1121",
    "image": "assets/images/1chair.jpg",
    "description": "Size is not decided yet",
    "price": 20499,
    "rating": 4,
    "category": "chair",
    "categoryLabel": "Chairs"
  },
  {
    "id": "18",
    "name": "Chair",
    "itemId": "1122",
    "image": "assets/images/c1.jpg",
    "description": "Size is not decided yet",
    "price": 7099,
    "rating": 4,
    "category": "chair",
    "categoryLabel": "Chairs"
  },
  {
    "id": "19",
    "name": "Chair",
    "itemId": "1123",
    "image": "assets/images/c2.jpg",
    "description": "Size is not decided yet",
    "price": 11999,
    "rating": 4,
    "category": "chair",
    "categoryLabel": "Chairs"
  },
  {
    "id": "20",
    "name": "Chair",
    "itemId": "1124",
    "image": "assets/images/c3.jpg",
    "description": "Size is not decided yet",
    "price": 4099,
    "rating": 4,
    "category": "chair",
    "categoryLabel": "Chairs"
  },
  {
    "id": "21",
    "name": "Chair",
    "itemId": "1125",
    "image": "assets/images/c4.jpg",
    "description": "Size is not decided yet",
    "price": 4009,
    "rating": 4,
    "category": "chair",
    "categoryLabel": "Chairs"
  },
  {
    "id": "22",
    "name": "Chair",
    "itemId": "1126",
    "image": "assets/images/3chair.jpg",
    "description": "Size is not decided yet",
    "price": 7999,
    "rating": 4,
    "category": "chair",
    "categoryLabel": "Chairs"
  },
  {
    "id": "23",
    "name": "Chair",
    "itemId": "1127",
    "image": "assets/images/4chair.jpg",
    "description": "Size is not decided yet",
    "price": 9999,
    "rating": 4,
    "category": "chair",
    "categoryLabel": "Chairs"
  },
  {
    "id": "24",
    "name": "Chair",
    "itemId": "1128",
    "image": "assets/images/5chair.jpg",
    "description": "Size is not decided yet",
    "price": 6999,
    "rating": 4,
    "category": "chair",
    "categoryLabel": "Chairs"
  },
  {
    "id": "25",
    "name": "Chair",
    "itemId": "109",
    "image": "assets/images/6chair.jpg",
    "description": "Size is not decided yet",
    "price": 6999,
    "rating": 4,
    "category": "chair",
    "categoryLabel": "Chairs"
  },
  {
    "id": "26",
    "name": "Chair",
    "itemId": "110",
    "image": "assets/images/7chair.jpg",
    "description": "Size is not decided yet",
    "price": 9999,
    "rating": 4,
    "category": "chair",
    "categoryLabel": "Chairs"
  },
  {
    "id": "27",
    "name": "Chair",
    "itemId": "111",
    "image": "assets/images/8chair.jpg",
    "description": "Size is not decided yet",
    "price": 5999,
    "rating": 4,
    "category": "chair",
    "categoryLabel": "Chairs"
  },
  {
    "id": "28",
    "name": "Chair",
    "itemId": "112",
    "image": "assets/images/9chair.jpg",
    "description": "Size is not decided yet",
    "price": 17999,
    "rating": 4,
    "category": "chair",
    "categoryLabel": "Chairs"
  },
  {
    "id": "29",
    "name": "Chair",
    "itemId": "10",
    "image": "assets/images/10chair.jpg",
    "description": "Size is not decided yet",
    "price": 20499,
    "rating": 4,
    "category": "chair",
    "categoryLabel": "Chairs"
  },
  {
    "id": "30",
    "name": "Chair",
    "itemId": "114",
    "image": "assets/images/achair.jpg",
    "description": "Size is not decided yet",
    "price": 3999,
    "rating": 4,
    "category": "chair",
    "categoryLabel": "Chairs"
  },
  {
    "id": "31",
    "name": "Chair",
    "itemId": "115",
    "image": "assets/images/achair1.jpg",
    "description": "Size is not decided yet",
    "price": 7999,
    "rating": 4,
    "category": "chair",
    "categoryLabel": "Chairs"
  },
  {
    "id": "32",
    "name": "Chair",
    "itemId": "116",
    "image": "assets/images/achair2.jpg",
    "description": "Size is not decided yet",
    "price": 9999,
    "rating": 4,
    "category": "chair",
    "categoryLabel": "Chairs"
  },
  {
    "id": "33",
    "name": "Chair",
    "itemId": "117",
    "image": "assets/images/achair4.jpg",
    "description": "Size is not decided yet",
    "price": 6999,
    "rating": 4,
    "category": "chair",
    "categoryLabel": "Chairs"
  },
  {
    "id": "34",
    "name": "Study Table",
    "itemId": "1129",
    "image": "assets/images/st.jpg",
    "description": "Size is not decided yet",
    "price": 13499,
    "rating": 4,
    "category": "studytables",
    "categoryLabel": "Study tables"
  },
  {
    "id": "35",
    "name": "Study Table",
    "itemId": "1130",
    "image": "assets/images/st1.jpg",
    "description": "Size is not decided yet",
    "price": 12999,
    "rating": 4,
    "category": "studytables",
    "categoryLabel": "Study tables"
  },
  {
    "id": "36",
    "name": "Study Table",
    "itemId": "1131",
    "image": "assets/images/st3.jpg",
    "description": "Size is not decided yet",
    "price": 15999,
    "rating": 4,
    "category": "studytables",
    "categoryLabel": "Study tables"
  },
  {
    "id": "37",
    "name": "Study Table",
    "itemId": "1132",
    "image": "assets/images/st4.jpg",
    "description": "Size is not decided yet",
    "price": 17999,
    "rating": 4,
    "category": "studytables",
    "categoryLabel": "Study tables"
  },
  {
    "id": "38",
    "name": "Study Table",
    "itemId": "1133",
    "image": "assets/images/st5.jpg",
    "description": "Size is not decided yet",
    "price": 13999,
    "rating": 4,
    "category": "studytables",
    "categoryLabel": "Study tables"
  },
  {
    "id": "39",
    "name": "Study Table",
    "itemId": "1134",
    "image": "assets/images/st6.jpg",
    "description": "Size is not decided yet",
    "price": 8999,
    "rating": 4,
    "category": "studytables",
    "categoryLabel": "Study tables"
  },
  {
    "id": "40",
    "name": "Study Table",
    "itemId": "1135",
    "image": "assets/images/st7.jpg",
    "description": "Size is not decided yet",
    "price": 12999,
    "rating": 4,
    "category": "studytables",
    "categoryLabel": "Study tables"
  },
  {
    "id": "41",
    "name": "Study Table",
    "itemId": "1136",
    "image": "assets/images/st8.jpg",
    "description": "Size is not decided yet",
    "price": 7999,
    "rating": 4,
    "category": "studytables",
    "categoryLabel": "Study tables"
  },
  {
    "id": "42",
    "name": "Sideboard Cabinet",
    "itemId": "1137",
    "image": "assets/images/side1.jpg",
    "description": "Size is not decided yet",
    "price": 15999,
    "rating": 4,
    "category": "sideboards",
    "categoryLabel": "Sideboards"
  },
  {
    "id": "43",
    "name": "Sideboard Cabinet",
    "itemId": "1138",
    "image": "assets/images/side2.jpg",
    "description": "Size is not decided yet",
    "price": 20499,
    "rating": 4,
    "category": "sideboards",
    "categoryLabel": "Sideboards"
  },
  {
    "id": "44",
    "name": "Sideboard Cabinet",
    "itemId": "1139",
    "image": "assets/images/side3.jpg",
    "description": "Size is not decided yet",
    "price": 25499,
    "rating": 4,
    "category": "sideboards",
    "categoryLabel": "Sideboards"
  },
  {
    "id": "45",
    "name": "Sideboard Cabinet",
    "itemId": "1140",
    "image": "assets/images/side4.jpg",
    "description": "Size is not decided yet",
    "price": 13999,
    "rating": 4,
    "category": "sideboards",
    "categoryLabel": "Sideboards"
  },
  {
    "id": "46",
    "name": "Sideboard Cabinet",
    "itemId": "1141",
    "image": "assets/images/side5.jpg",
    "description": "Size is not decided yet",
    "price": 15999,
    "rating": 4,
    "category": "sideboards",
    "categoryLabel": "Sideboards"
  },
  {
    "id": "47",
    "name": "Sideboard Cabinet",
    "itemId": "1142",
    "image": "assets/images/side6.jpg",
    "description": "Size is not decided yet",
    "price": 17999,
    "rating": 4,
    "category": "sideboards",
    "categoryLabel": "Sideboards"
  },
  {
    "id": "48",
    "name": "Sideboard Cabinet",
    "itemId": "1143",
    "image": "assets/images/side7.jpg",
    "description": "Size is not decided yet",
    "price": 19099,
    "rating": 4,
    "category": "sideboards",
    "categoryLabel": "Sideboards"
  },
  {
    "id": "49",
    "name": "Sideboard Cabinet",
    "itemId": "1144",
    "image": "assets/images/side8.jpg",
    "description": "Size is not decided yet",
    "price": 8999,
    "rating": 4,
    "category": "sideboards",
    "categoryLabel": "Sideboards"
  },
  {
    "id": "50",
    "name": "Sideboard Cabinet",
    "itemId": "1145",
    "image": "assets/images/side9.jpg",
    "description": "Size is not decided yet",
    "price": 15999,
    "rating": 4,
    "category": "sideboards",
    "categoryLabel": "Sideboards"
  },
  {
    "id": "51",
    "name": "Sideboard Cabinet",
    "itemId": "1146",
    "image": "assets/images/side10.jpg",
    "description": "Size is not decided yet",
    "price": 24999,
    "rating": 4,
    "category": "sideboards",
    "categoryLabel": "Sideboards"
  },
  {
    "id": "52",
    "name": "Sideboard Cabinet",
    "itemId": "1147",
    "image": "assets/images/side12.jpg",
    "description": "Size is not decided yet",
    "price": 21999,
    "rating": 4,
    "category": "sideboards",
    "categoryLabel": "Sideboards"
  },
  {
    "id": "53",
    "name": "Sideboard Cabinet",
    "itemId": "1148",
    "image": "assets/images/side11..jpg",
    "description": "Size is not decided yet",
    "price": 21999,
    "rating": 4,
    "category": "sideboards",
    "categoryLabel": "Sideboards"
  },
  {
    "id": "54",
    "name": "Bed",
    "itemId": "1149",
    "image": "assets/images/b1.jpg",
    "description": "Size is not decided yet",
    "price": 30999,
    "rating": 4,
    "category": "beds",
    "categoryLabel": "Beds"
  },
  {
    "id": "55",
    "name": "Bed",
    "itemId": "1150",
    "image": "assets/images/b2.jpg",
    "description": "Size is not decided yet",
    "price": 22999,
    "rating": 4,
    "category": "beds",
    "categoryLabel": "Beds"
  },
  {
    "id": "56",
    "name": "Bed",
    "itemId": "1151",
    "image": "assets/images/b3.jpg",
    "description": "Size is not decided yet",
    "price": 31999,
    "rating": 4,
    "category": "beds",
    "categoryLabel": "Beds"
  },
  {
    "id": "57",
    "name": "Bed",
    "itemId": "1152",
    "image": "assets/images/b4.jpg",
    "description": "Size is not decided yet",
    "price": 21999,
    "rating": 4,
    "category": "beds",
    "categoryLabel": "Beds"
  },
  {
    "id": "58",
    "name": "Bed",
    "itemId": "1153",
    "image": "assets/images/b5.jpg",
    "description": "Size is not decided yet",
    "price": 30999,
    "rating": 4,
    "category": "beds",
    "categoryLabel": "Beds"
  },
  {
    "id": "59",
    "name": "Bed",
    "itemId": "1154",
    "image": "assets/images/b9.jpg",
    "description": "Size is not decided yet",
    "price": 27999,
    "rating": 4,
    "category": "beds",
    "categoryLabel": "Beds"
  },
  {
    "id": "60",
    "name": "Bed",
    "itemId": "1155",
    "image": "assets/images/b10.jpg",
    "description": "Size is not decided yet",
    "price": 31999,
    "rating": 4,
    "category": "beds",
    "categoryLabel": "Beds"
  },
  {
    "id": "61",
    "name": "Bed",
    "itemId": "1156",
    "image": "assets/images/b11.jpg",
    "description": "Size is not decided yet",
    "price": 20999,
    "rating": 4,
    "category": "beds",
    "categoryLabel": "Beds"
  },
  {
    "id": "62",
    "name": "Bed",
    "itemId": "1157",
    "image": "assets/images/b12.jpg",
    "description": "Size is not decided yet",
    "price": 35999,
    "rating": 4,
    "category": "beds",
    "categoryLabel": "Beds"
  },
  {
    "id": "63",
    "name": "Bed",
    "itemId": "113",
    "image": "assets/images/b13.jpg",
    "description": "Size is not decided yet",
    "price": 51999,
    "rating": 4,
    "category": "beds",
    "categoryLabel": "Beds"
  },
  {
    "id": "64",
    "name": "Bed",
    "itemId": "1158",
    "image": "assets/images/b14.jpg",
    "description": "Size is not decided yet",
    "price": 19999,
    "rating": 4,
    "category": "beds",
    "categoryLabel": "Beds"
  },
  {
    "id": "65",
    "name": "Bed",
    "itemId": "1159",
    "image": "assets/images/b15.jpg",
    "description": "Size is not decided yet",
    "price": 21999,
    "rating": 4,
    "category": "beds",
    "categoryLabel": "Beds"
  },
  {
    "id": "66",
    "name": "Bed",
    "itemId": "1160",
    "image": "assets/images/side8.jpg",
    "description": "Size is not decided yet",
    "price": 33999,
    "rating": 4,
    "category": "beds",
    "categoryLabel": "Beds"
  },
  {
    "id": "67",
    "name": "Dining Table",
    "itemId": "1161",
    "image": "assets/images/dt1.jpg",
    "description": "Size is not decided yet",
    "price": 22860,
    "rating": 4,
    "category": "diningtable",
    "categoryLabel": "Dining tables"
  },
  {
    "id": "68",
    "name": "Dining Table",
    "itemId": "1162",
    "image": "assets/images/dt2.jpg",
    "description": "Size is not decided yet",
    "price": 93999,
    "rating": 4,
    "category": "diningtable",
    "categoryLabel": "Dining tables"
  },
  {
    "id": "69",
    "name": "Dining Table",
    "itemId": "1163",
    "image": "assets/images/dt3.jpg",
    "description": "Size is not decided yet",
    "price": 38899,
    "rating": 4,
    "category": "diningtable",
    "categoryLabel": "Dining tables"
  },
  {
    "id": "70",
    "name": "Dining Table",
    "itemId": "1164",
    "image": "assets/images/dt4.jpg",
    "description": "Size is not decided yet",
    "price": 54899,
    "rating": 4,
    "category": "diningtable",
    "categoryLabel": "Dining tables"
  },
  {
    "id": "71",
    "name": "Dining Table",
    "itemId": "1165",
    "image": "assets/images/dt5.jpg",
    "description": "Size is not decided yet",
    "price": 40499,
    "rating": 4,
    "category": "diningtable",
    "categoryLabel": "Dining tables"
  },
  {
    "id": "72",
    "name": "Dining Table",
    "itemId": "1166",
    "image": "assets/images/dt6.jpg",
    "description": "Size is not decided yet",
    "price": 13999,
    "rating": 4,
    "category": "diningtable",
    "categoryLabel": "Dining tables"
  },
  {
    "id": "73",
    "name": "Dining Table",
    "itemId": "1167",
    "image": "assets/images/dt7.jpg",
    "description": "Size is not decided yet",
    "price": 35999,
    "rating": 4,
    "category": "diningtable",
    "categoryLabel": "Dining tables"
  },
  {
    "id": "74",
    "name": "Dining Table",
    "itemId": "1168",
    "image": "assets/images/dt8.jpg",
    "description": "Size is not decided yet",
    "price": 28999,
    "rating": 4,
    "category": "diningtable",
    "categoryLabel": "Dining tables"
  },
  {
    "id": "75",
    "name": "Dining Table",
    "itemId": "1169",
    "image": "assets/images/dt9.jpg",
    "description": "Size is not decided yet",
    "price": 91999,
    "rating": 4,
    "category": "diningtable",
    "categoryLabel": "Dining tables"
  },
  {
    "id": "76",
    "name": "Dining Table",
    "itemId": "1170",
    "image": "assets/images/dt10.jpg",
    "description": "Size is not decided yet",
    "price": 23099,
    "rating": 4,
    "category": "diningtable",
    "categoryLabel": "Dining tables"
  },
  {
    "id": "77",
    "name": "Dining Table",
    "itemId": "1171",
    "image": "assets/images/dt11.jpg",
    "description": "Size is not decided yet",
    "price": 63099,
    "rating": 4,
    "category": "diningtable",
    "categoryLabel": "Dining tables"
  },
  {
    "id": "78",
    "name": "Dining Table",
    "itemId": "1172",
    "image": "assets/images/dt12.jpg",
    "description": "Size is not decided yet",
    "price": 49099,
    "rating": 4,
    "category": "diningtable",
    "categoryLabel": "Dining tables"
  },
  {
    "id": "79",
    "name": "Dining Table",
    "itemId": "1173",
    "image": "assets/images/dt13.jpg",
    "description": "Size is not decided yet",
    "price": 29099,
    "rating": 4,
    "category": "diningtable",
    "categoryLabel": "Dining tables"
  },
  {
    "id": "80",
    "name": "Dining Table",
    "itemId": "1174",
    "image": "assets/images/dt15.jpg",
    "description": "Size is not decided yet",
    "price": 27099,
    "rating": 4,
    "category": "diningtable",
    "categoryLabel": "Dining tables"
  },
  {
    "id": "81",
    "name": "Dining Table",
    "itemId": "1175",
    "image": "assets/images/dt16.jpg",
    "description": "Size is not decided yet",
    "price": 40909,
    "rating": 4,
    "category": "diningtable",
    "categoryLabel": "Dining tables"
  },
  {
    "id": "82",
    "name": "Coffee Table",
    "itemId": "1176",
    "image": "assets/images/ct.jpg",
    "description": "Size is not decided yet",
    "price": null,
    "rating": 4,
    "category": "coffeetable",
    "categoryLabel": "Coffee tables"
  },
  {
    "id": "83",
    "name": "Coffee Table",
    "itemId": "1177",
    "image": "assets/images/ct2.jpg",
    "description": "Size is not decided yet",
    "price": null,
    "rating": 4,
    "category": "coffeetable",
    "categoryLabel": "Coffee tables"
  },
  {
    "id": "84",
    "name": "Coffee Table",
    "itemId": "1178",
    "image": "assets/images/ct4.jpg",
    "description": "Size is not decided yet",
    "price": null,
    "rating": 4,
    "category": "coffeetable",
    "categoryLabel": "Coffee tables"
  },
  {
    "id": "85",
    "name": "Coffee Table",
    "itemId": "1179",
    "image": "assets/images/ct6.jpeg",
    "description": "Size is not decided yet",
    "price": 11999,
    "rating": 4,
    "category": "coffeetable",
    "categoryLabel": "Coffee tables"
  },
  {
    "id": "86",
    "name": "Shoe Rack",
    "itemId": "1180",
    "image": "assets/images/sr.jpg",
    "description": "Size is not decided yet",
    "price": null,
    "rating": 4,
    "category": "shoeracks",
    "categoryLabel": "Shoe racks"
  },
  {
    "id": "87",
    "name": "Shoe Rack",
    "itemId": "1181",
    "image": "assets/images/sr1.jpg",
    "description": "Size is not decided yet",
    "price": null,
    "rating": 4,
    "category": "shoeracks",
    "categoryLabel": "Shoe racks"
  },
  {
    "id": "88",
    "name": "Shoe Rack",
    "itemId": "1182",
    "image": "assets/images/sr2.jpg",
    "description": "Size is not decided yet",
    "price": null,
    "rating": 4,
    "category": "shoeracks",
    "categoryLabel": "Shoe racks"
  },
  {
    "id": "89",
    "name": "Shoe Rack",
    "itemId": "1183",
    "image": "assets/images/sr3.jpg",
    "description": "Size is not decided yet",
    "price": null,
    "rating": 4,
    "category": "shoeracks",
    "categoryLabel": "Shoe racks"
  },
  {
    "id": "90",
    "name": "Shoe Rack",
    "itemId": "1184",
    "image": "assets/images/sr4.jpg",
    "description": "Size is not decided yet",
    "price": null,
    "rating": 4,
    "category": "shoeracks",
    "categoryLabel": "Shoe racks"
  },
  {
    "id": "91",
    "name": "Shoe Rack",
    "itemId": "1185",
    "image": "assets/images/sr5.jpg",
    "description": "Size is not decided yet",
    "price": null,
    "rating": 4,
    "category": "shoeracks",
    "categoryLabel": "Shoe racks"
  },
  {
    "id": "92",
    "name": "Shoe Rack",
    "itemId": "1186",
    "image": "assets/images/sr6.jpeg",
    "description": "Size is not decided yet",
    "price": null,
    "rating": 4,
    "category": "shoeracks",
    "categoryLabel": "Shoe racks"
  },
  {
    "id": "93",
    "name": "Shoe Rack",
    "itemId": "1187",
    "image": "assets/images/sr7.jpg",
    "description": "Size is not decided yet",
    "price": null,
    "rating": 4,
    "category": "shoeracks",
    "categoryLabel": "Shoe racks"
  },
  {
    "id": "94",
    "name": "Wooden Temple",
    "itemId": "1188",
    "image": "assets/images/temp1.jpg",
    "description": "Size is not decided yet",
    "price": null,
    "rating": 5,
    "category": "woodentemple",
    "categoryLabel": "Wooden temples"
  },
  {
    "id": "95",
    "name": "Wooden Temple",
    "itemId": "1189",
    "image": "assets/images/temp2.jpg",
    "description": "Size is not decided yet",
    "price": null,
    "rating": 5,
    "category": "woodentemple",
    "categoryLabel": "Wooden temples"
  },
  {
    "id": "96",
    "name": "Wooden Temple",
    "itemId": "1190",
    "image": "assets/images/temp3.jpeg",
    "description": "Size is not decided yet",
    "price": null,
    "rating": 5,
    "category": "woodentemple",
    "categoryLabel": "Wooden temples"
  },
  {
    "id": "97",
    "name": "Wooden Temple",
    "itemId": "1191",
    "image": "assets/images/temp4.jpeg",
    "description": "Size is not decided yet",
    "price": null,
    "rating": 5,
    "category": "woodentemple",
    "categoryLabel": "Wooden temples"
  },
  {
    "id": "98",
    "name": "Rocking chair",
    "itemId": "1112",
    "image": "assets/images/achair3.jpg",
    "description": "Size is not decided yet",
    "price": null,
    "rating": 5,
    "category": "chair",
    "categoryLabel": "Chairs"
  }
].map((product) => Object.freeze({
  ...product,
  description: product.description === 'Size is not decided yet'
    ? buildProductDescription(product)
    : product.description,
  bookingUrl: product.bookingUrl || `details.html?id=${product.id}`,
}))
);

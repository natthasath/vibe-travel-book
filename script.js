let provinceData = {};
let currentProvince = '';
let selectedColor = '#ff4757'; // Default: หน้าร้อน (red)
let selectedSeason = 'หน้าร้อน';   // Default: หน้าร้อน
let thailandGeoData = null;

const LOCAL_STORAGE_KEY = 'thailandTravelBookData';

const DATA_SOURCES = [
    {
        name: 'GitHub - holtzy',
        url: 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
    },
    {
        name: 'Local Thailand Data',
        url: null
    }
];

const thailandGeoDataFallback = {
    "type": "FeatureCollection",
    "features": [
        // ... (Fallback GeoJSON data remains the same as provided) ...
        {
            "type": "Feature",
            "properties": {"name": "กรุงเทพมหานคร", "name_en": "Bangkok"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[100.35, 13.55], [100.75, 13.55], [100.75, 13.95], [100.35, 13.95], [100.35, 13.55]]]
            }
        },
        {
            "type": "Feature", 
            "properties": {"name": "เชียงใหม่", "name_en": "Chiang Mai"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[98.3, 18.2], [99.8, 18.2], [99.8, 20.5], [98.3, 20.5], [98.3, 18.2]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "เชียงราย", "name_en": "Chiang Rai"},
            "geometry": {
                "type": "Polygon", 
                "coordinates": [[[99.3, 19.5], [100.8, 19.5], [100.8, 20.9], [99.3, 20.9], [99.3, 19.5]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "นครราชสีมา", "name_en": "Nakhon Ratchasima"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[101.3, 14.2], [103.0, 14.2], [103.0, 15.8], [101.3, 15.8], [101.3, 14.2]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "อุดรธานี", "name_en": "Udon Thani"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[102.2, 17.0], [103.5, 17.0], [103.5, 18.3], [102.2, 18.3], [102.2, 17.0]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ขอนแก่น", "name_en": "Khon Kaen"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[102.0, 15.8], [103.3, 15.8], [103.3, 17.0], [102.0, 17.0], [102.0, 15.8]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "อุบลราชธานี", "name_en": "Ubon Ratchathani"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[104.2, 14.8], [105.6, 14.8], [105.6, 15.9], [104.2, 15.9], [104.2, 14.8]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ชลบุรี", "name_en": "Chonburi"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[100.5, 12.5], [101.8, 12.5], [101.8, 13.8], [100.5, 13.8], [100.5, 12.5]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ระยอง", "name_en": "Rayong"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[101.0, 12.2], [101.8, 12.2], [101.8, 13.0], [101.0, 13.0], [101.0, 12.2]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "จันทบุรี", "name_en": "Chanthaburi"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[101.5, 12.0], [102.8, 12.0], [102.8, 13.2], [101.5, 13.2], [101.5, 12.0]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ตราด", "name_en": "Trat"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[102.3, 11.6], [103.0, 11.6], [103.0, 12.8], [102.3, 12.8], [102.3, 11.6]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "สุราษฎร์ธานี", "name_en": "Surat Thani"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[98.2, 8.2], [100.2, 8.2], [100.2, 9.8], [98.2, 9.8], [98.2, 8.2]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "นครศรีธรรมราช", "name_en": "Nakhon Si Thammarat"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[99.0, 7.5], [100.5, 7.5], [100.5, 9.0], [99.0, 9.0], [99.0, 7.5]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "สงขลา", "name_en": "Songkhla"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[100.0, 6.2], [101.3, 6.2], [101.3, 7.8], [100.0, 7.8], [100.0, 6.2]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ภูเก็ต", "name_en": "Phuket"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[98.0, 7.5], [98.5, 7.5], [98.5, 8.3], [98.0, 8.3], [98.0, 7.5]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "กระบี่", "name_en": "Krabi"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[98.3, 7.8], [99.5, 7.8], [99.5, 8.8], [98.3, 8.8], [98.3, 7.8]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ปัตตานี", "name_en": "Pattani"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[100.8, 5.8], [101.8, 5.8], [101.8, 7.0], [100.8, 7.0], [100.8, 5.8]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ยะลา", "name_en": "Yala"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[100.8, 5.2], [101.8, 5.2], [101.8, 6.5], [100.8, 6.5], [100.8, 5.2]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "นราธิวาส", "name_en": "Narathiwat"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[101.2, 5.0], [102.2, 5.0], [102.2, 6.8], [101.2, 6.8], [101.2, 5.0]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ลำปาง", "name_en": "Lampang"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[99.2, 17.8], [100.0, 17.8], [100.0, 19.0], [99.2, 19.0], [99.2, 17.8]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "พะเยา", "name_en": "Phayao"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[99.5, 19.0], [100.2, 19.0], [100.2, 20.0], [99.5, 20.0], [99.5, 19.0]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "น่าน", "name_en": "Nan"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[100.3, 18.0], [101.2, 18.0], [101.2, 19.8], [100.3, 19.8], [100.3, 18.0]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "แพร่", "name_en": "Phrae"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[99.8, 17.5], [100.8, 17.5], [100.8, 18.8], [99.8, 18.8], [99.8, 17.5]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "อุตรดิตถ์", "name_en": "Uttaradit"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[100.0, 17.0], [100.8, 17.0], [100.8, 18.0], [100.0, 18.0], [100.0, 17.0]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ตาก", "name_en": "Tak"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[98.5, 15.8], [99.8, 15.8], [99.8, 17.8], [98.5, 17.8], [98.5, 15.8]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "กาญจนบุรี", "name_en": "Kanchanaburi"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[98.3, 13.8], [99.8, 13.8], [99.8, 15.2], [98.3, 15.2], [98.3, 13.8]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "สุพรรณบุรี", "name_en": "Suphan Buri"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[99.5, 14.0], [100.2, 14.0], [100.2, 15.2], [99.5, 15.2], [99.5, 14.0]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "นครปฐม", "name_en": "Nakhon Pathom"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[99.8, 13.5], [100.3, 13.5], [100.3, 14.2], [99.8, 14.2], [99.8, 13.5]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "นนทบุรี", "name_en": "Nonthaburi"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[100.2, 13.7], [100.6, 13.7], [100.6, 14.2], [100.2, 14.2], [100.2, 13.7]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ปทุมธานี", "name_en": "Pathum Thani"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[100.4, 13.8], [100.9, 13.8], [100.9, 14.3], [100.4, 14.3], [100.4, 13.8]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "สมุทรปราการ", "name_en": "Samut Prakan"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[100.3, 13.3], [100.8, 13.3], [100.8, 13.8], [100.3, 13.8], [100.3, 13.3]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "เพชรบุรี", "name_en": "Phetchaburi"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[99.5, 12.5], [100.2, 12.5], [100.2, 13.5], [99.5, 13.5], [99.5, 12.5]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ประจวบคีรีขันธ์", "name_en": "Prachuap Khiri Khan"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[99.2, 11.0], [100.0, 11.0], [100.0, 12.8], [99.2, 12.8], [99.2, 11.0]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ชุมพร", "name_en": "Chumphon"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[98.8, 9.8], [99.8, 9.8], [99.8, 11.2], [98.8, 11.2], [98.8, 9.8]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ระนอง", "name_en": "Ranong"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[98.2, 9.2], [99.2, 9.2], [99.2, 10.8], [98.2, 10.8], [98.2, 9.2]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "สตูล", "name_en": "Satun"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[99.3, 6.0], [100.3, 6.0], [100.3, 7.2], [99.3, 7.2], [99.3, 6.0]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "หนองคาย", "name_en": "Nong Khai"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[102.0, 17.5], [104.0, 17.5], [104.0, 18.5], [102.0, 18.5], [102.0, 17.5]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "เลย", "name_en": "Loei"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[101.0, 17.0], [102.2, 17.0], [102.2, 18.0], [101.0, 18.0], [101.0, 17.0]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "สกลนคร", "name_en": "Sakon Nakhon"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[103.0, 16.8], [104.5, 16.8], [104.5, 17.8], [103.0, 17.8], [103.0, 16.8]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "มุกดาหาร", "name_en": "Mukdahan"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[104.0, 15.8], [105.0, 15.8], [105.0, 17.0], [104.0, 17.0], [104.0, 15.8]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "บุรีรัมย์", "name_en": "Buriram"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[102.5, 14.2], [103.8, 14.2], [103.8, 15.2], [102.5, 15.2], [102.5, 14.2]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "สุรินทร์", "name_en": "Surin"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[103.2, 14.2], [104.5, 14.2], [104.5, 15.2], [103.2, 15.2], [103.2, 14.2]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ศีสะเกษ", "name_en": "Sisaket"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[104.0, 14.0], [105.2, 14.0], [105.2, 15.2], [104.0, 15.2], [104.0, 14.0]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "สระแก้ว", "name_en": "Sa Kaeo"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[102.0, 13.2], [102.8, 13.2], [102.8, 14.5], [102.0, 14.5], [102.0, 13.2]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ปราจีนบุรี", "name_en": "Prachinburi"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[101.0, 13.5], [102.0, 13.5], [102.0, 14.5], [101.0, 14.5], [101.0, 13.5]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "สระบุรี", "name_en": "Saraburi"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[100.5, 14.2], [101.2, 14.2], [101.2, 15.0], [100.5, 15.0], [100.5, 14.2]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ลพบุรี", "name_en": "Lopburi"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[100.3, 14.5], [101.0, 14.5], [101.0, 15.5], [100.3, 15.5], [100.3, 14.5]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ชัยนาท", "name_en": "Chai Nat"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[100.0, 15.0], [100.5, 15.0], [100.5, 15.8], [100.0, 15.8], [100.0, 15.0]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "สิงห์บุรี", "name_en": "Sing Buri"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[100.2, 14.8], [100.7, 14.8], [100.7, 15.2], [100.2, 15.2], [100.2, 14.8]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "อ่างทอง", "name_en": "Ang Thong"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[100.3, 14.3], [100.8, 14.3], [100.8, 15.0], [100.3, 15.0], [100.3, 14.3]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "พิษณุโลก", "name_en": "Phitsanulok"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[100.0, 16.0], [101.0, 16.0], [101.0, 17.2], [100.0, 17.2], [100.0, 16.0]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "เพชรบูรณ์", "name_en": "Phetchabun"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[100.5, 15.5], [101.8, 15.5], [101.8, 16.8], [100.5, 16.8], [100.5, 15.5]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ขาน", "name_en": "Kamphaeng Phet"}, // Note: Name in Thai might be "กำแพงเพชร"
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[99.2, 15.8], [100.2, 15.8], [100.2, 16.8], [99.2, 16.8], [99.2, 15.8]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "สุโขทัย", "name_en": "Sukhothai"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[99.5, 16.8], [100.5, 16.8], [100.5, 17.8], [99.5, 17.8], [99.5, 16.8]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "นครสวรรค์", "name_en": "Nakhon Sawan"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[99.8, 15.2], [100.8, 15.2], [100.8, 16.0], [99.8, 16.0], [99.8, 15.2]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "อุทัยธานี", "name_en": "Uthai Thani"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[99.2, 15.0], [100.0, 15.0], [100.0, 15.8], [99.2, 15.8], [99.2, 15.0]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ชัยภูมิ", "name_en": "Chaiyaphum"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[101.5, 15.2], [102.8, 15.2], [102.8, 16.8], [101.5, 16.8], [101.5, 15.2]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "มหาสารคาม", "name_en": "Maha Sarakham"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[102.8, 15.8], [103.8, 15.8], [103.8, 16.5], [102.8, 16.5], [102.8, 15.8]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ร้อยเอ็ด", "name_en": "Roi Et"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[103.2, 15.2], [104.2, 15.2], [104.2, 16.2], [103.2, 16.2], [103.2, 15.2]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "กาฬสินธุ์", "name_en": "Kalasin"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[103.0, 16.0], [104.0, 16.0], [104.0, 17.0], [103.0, 17.0], [103.0, 16.0]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "หนองบัวลำภู", "name_en": "Nong Bua Lam Phu"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[102.0, 17.0], [103.0, 17.0], [103.0, 17.8], [102.0, 17.8], [102.0, 17.0]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "อำนาจเจริญ", "name_en": "Amnat Charoen"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[104.5, 15.5], [105.2, 15.5], [105.2, 16.2], [104.5, 16.2], [104.5, 15.5]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ยโสธร", "name_en": "Yasothon"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[104.0, 15.0], [104.8, 15.0], [104.8, 15.8], [104.0, 15.8], [104.0, 15.0]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "สมุทรสาคร", "name_en": "Samut Sakhon"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[100.0, 13.2], [100.4, 13.2], [100.4, 13.7], [100.0, 13.7], [100.0, 13.2]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "สมุทรสงคราม", "name_en": "Samut Songkhram"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[99.8, 13.2], [100.2, 13.2], [100.2, 13.6], [99.8, 13.6], [99.8, 13.2]]]
            }
        },
        {
            "type": "Feature",
            "properties": {"name": "ราชบุรี", "name_en": "Ratchaburi"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[99.3, 13.2], [100.0, 13.2], [100.0, 14.0], [99.3, 14.0], [99.3, 13.2]]]
            }
        }
    ]
};

// --- LocalStorage Functions ---
function loadProvinceDataFromLocalStorage() {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
        provinceData = JSON.parse(storedData);
        console.log('Province data loaded from localStorage.');
    } else {
        provinceData = {};
        console.log('No province data found in localStorage, initializing as empty.');
    }
}

function saveProvinceDataToLocalStorage() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(provinceData));
    console.log('Province data saved to localStorage.');
}

// --- Initialization Logic ---
function initializeProvinceDataStructure(geoData) {
    if (!geoData || !geoData.features) return;
    let structureChanged = false;
    geoData.features.forEach(feature => {
        const provinceName = getProvinceName(feature);
        if (provinceName && provinceName !== 'Unknown Province' && !provinceData[provinceName]) {
            provinceData[provinceName] = {
                visited: false,
                color: '#ffffff',
                season: 'ยังไม่ได้ระบุ', // Consistent with legend
                timestamp: null 
            };
            structureChanged = true;
        }
    });
    if (structureChanged) {
        console.log('Initialized new provinces in provinceData structure.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadProvinceDataFromLocalStorage();
    loadThailandData();
    bindModalEvents();
});

async function loadThailandData() {
    const svg = d3.select("#thailand-svg");
    
    try {
        svg.select("text").text("กำลังโหลดข้อมูลแผนที่ประเทศไทย...");
        console.log('Starting to load Thailand map data...');
        
        let loadedGeoData = null; 
        
        try {
            // This part is for Electron-like environments. For web, it will fail.
            // If you intend this for a pure web environment, remove or comment out the 'window.fs' part.
            // console.log('Attempting to load local GeoJSON file: geoBoundaries-THA-ADM1.geojson');
            // svg.select("text").text("กำลังโหลดแผนที่จากไฟล์ geoBoundaries-THA-ADM1.geojson...");
            // const fileContent = await window.fs.readFile('geoBoundaries-THA-ADM1.geojson', { encoding: 'utf8' });
            // loadedGeoData = JSON.parse(fileContent);
            // console.log('Successfully loaded local GeoJSON file');
            // svg.select("text").text("โหลดแผนที่สำเร็จจากไฟล์ local...");
            // await new Promise(resolve => setTimeout(resolve, 300));
            throw new Error("Local file system access (window.fs) not available in standard web environment. Skipping.");

        } catch (fileError) {
            console.log('Local file loading skipped or failed, trying alternative sources:', fileError.message);
            svg.select("text").text("ไม่พบไฟล์ local กำลังลองแหล่งข้อมูลอื่น...");
            
            const alternativeSources = [
                'https://raw.githubusercontent.com/thailand-geography-maps/thailand-geography-maps/main/src/data/thailand.geojson',
                'https://raw.githubusercontent.com/apisit/thailand.json/master/thailand.json'
                // Add more URLs if needed
            ];
            
            for (const url of alternativeSources) {
                try {
                    console.log(`Trying to fetch from: ${url}`);
                    const response = await fetch(url);
                    if (response.ok) {
                        loadedGeoData = await response.json();
                        console.log('Successfully loaded from:', url);
                        break; 
                    } else {
                        console.warn(`Failed to load from ${url}, status: ${response.status}`);
                    }
                } catch (e) {
                    console.error(`Error fetching from ${url}:`, e.message);
                    continue;
                }
            }
        }
        
        if (!loadedGeoData) {
            console.log('All external sources failed, using fallback embedded data.');
            loadedGeoData = thailandGeoDataFallback;
            svg.select("text").text("ใช้ข้อมูลแผนที่สำรอง...");
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        thailandGeoData = loadedGeoData;
        
        initializeProvinceDataStructure(thailandGeoData);
        saveProvinceDataToLocalStorage(); 
        
        loadMap();
        updateStats();
        
    } catch (error) {
        console.error('Critical error during Thailand data loading process:', error);
        console.log('Using emergency fallback data due to overall error.');
        thailandGeoData = thailandGeoDataFallback; // Ensure this is assigned
        initializeProvinceDataStructure(thailandGeoData);
        saveProvinceDataToLocalStorage();
        loadMap(); // Try to load map even with fallback
        updateStats();
    }
}

function loadMap() {
    if (!thailandGeoData || !thailandGeoData.features || thailandGeoData.features.length === 0) {
        console.error('No valid GeoJSON data or features available to load map.');
         d3.select("#thailand-svg").selectAll("*").remove();
         d3.select("#thailand-svg").append("text")
            .attr("x", 300).attr("y", 400).attr("text-anchor", "middle")
            .attr("font-size", "16").attr("fill", "#cc0000")
            .text("ไม่สามารถแสดงข้อมูลแผนที่ได้");
        document.getElementById('totalProvinces').textContent = 'N/A'; // Update stats display
        return;
    }

    const svg = d3.select("#thailand-svg");
    svg.selectAll("*").remove(); 

    const width = 600;
    const height = 800;

    const bounds = d3.geoBounds(thailandGeoData);
    if (!isFinite(bounds[0][0]) || !isFinite(bounds[0][1]) || !isFinite(bounds[1][0]) || !isFinite(bounds[1][1])) {
        console.error('Invalid bounds calculated from GeoJSON data. Using default projection values.');
        // Default projection values if bounds are invalid
        projection = d3.geoMercator().center([100.9925, 15.8700]).scale(1800).translate([width / 2, height / 2]);
    } else {
        const centerLon = (bounds[0][0] + bounds[1][0]) / 2;
        const centerLat = (bounds[0][1] + bounds[1][1]) / 2;
        projection = d3.geoMercator()
            .center([centerLon, centerLat])
            .translate([width / 2, height / 2]);

        projection.scale(1).translate([0, 0]);
        const pathGenForScale = d3.geoPath().projection(projection);
        const b = pathGenForScale.bounds(thailandGeoData);
        // Check if bounds b are valid before calculating scale s and translation t
        if (isFinite(b[0][0]) && isFinite(b[0][1]) && isFinite(b[1][0]) && isFinite(b[1][1]) && (b[1][0] - b[0][0]) > 0 && (b[1][1] - b[0][1]) > 0) {
            const s = Math.min(width / (b[1][0] - b[0][0]), height / (b[1][1] - b[0][1])) * 0.85;
            const t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
            projection.scale(s).translate(t);
        } else {
            console.warn('Could not auto-calculate scale and translate for projection due to invalid path bounds. Using default scale.');
            projection.scale(1800); // Fallback scale
        }
    }
    
    const pathGenerator = d3.geoPath().projection(projection);

    svg.selectAll("path.province")
        .data(thailandGeoData.features)
        .enter()
        .append("path")
        .attr("d", pathGenerator)
        .attr("class", "province")
        .attr("data-province", d => getProvinceName(d))
        .style("fill", d => {
            const provinceName = getProvinceName(d);
            const data = provinceData[provinceName];
            return data && data.visited ? data.color : "#ffffff";
        })
        .classed("visited", d => {
            const provinceName = getProvinceName(d);
            const data = provinceData[provinceName];
            return data && data.visited;
        })
        .style("stroke", "#333333")
        .style("stroke-width", "1.5px")
        .style("cursor", "pointer")
        .on("click", function(event, d) {
            currentProvince = getProvinceName(d);
            if (currentProvince === 'Unknown Province') {
                showNotification("⚠️ ไม่สามารถระบุชื่อจังหวัดนี้ได้");
                return;
            }
            showModal(currentProvince);
        })
        .on("mouseover", function(event, d) {
            d3.select(this)
                .style("fill", "#f0f8ff")
                .style("stroke-width", "2.5px");
            showTooltip(event, getProvinceName(d));
        })
        .on("mouseout", function(event, d) {
            const provinceName = getProvinceName(d);
            const data = provinceData[provinceName];
            const fillColor = data && data.visited ? data.color : "#ffffff";
            d3.select(this)
                .style("fill", fillColor)
                .style("stroke-width", "1.5px");
            hideTooltip();
        });

    createTooltip();
    console.log(`Map loaded successfully with ${thailandGeoData.features.length} features.`);
    const unknownProvinces = thailandGeoData.features.filter(f => getProvinceName(f) === 'Unknown Province');
    if (unknownProvinces.length > 0) {
        console.warn(`Found ${unknownProvinces.length} features with unknown names.`);
    }
}

function getProvinceName(feature) {
    const properties = feature.properties;
    if (!properties) return 'Unknown Province';
    
    const nameKeys = ['ADM1_TH', 'name', 'NAME', 'NAME_1', 'name_th', 'PROV_NAM_T', 'ADM1_EN', 'name_en'];
    for (const key of nameKeys) {
        if (properties[key]) return String(properties[key]).trim();
    }
    
    const fallbackKeys = Object.keys(properties).filter(key => 
        key.toLowerCase().includes('name') || 
        key.toLowerCase().includes('th') ||
        key.toLowerCase().includes('prov')
    );
    if (fallbackKeys.length > 0) return String(properties[fallbackKeys[0]]).trim();
    
    console.warn('Could not determine province name from properties:', properties);
    return 'Unknown Province';
}

function createTooltip() {
    d3.select("#map-tooltip").remove();
    d3.select("body").append("div")
        .attr("id", "map-tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0,0,0,0.8)")
        .style("color", "white")
        .style("padding", "8px 12px")
        .style("border-radius", "6px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("z-index", 1000);
}

function showTooltip(event, text) {
    const tooltip = d3.select("#map-tooltip");
    let tooltipContent = `<strong>${text}</strong>`;
    // const data = provinceData[text];
    // if (data && data.visited && data.season && data.season !== 'ยังไม่ได้ระบุ') {
    //     tooltipContent += `<br/>🌈 ฤดู: ${data.season}`;
    // }
    tooltip.transition().duration(200).style("opacity", 1);
    tooltip.html(tooltipContent)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px");
}

function hideTooltip() {
    d3.select("#map-tooltip").transition().duration(500).style("opacity", 0);
}

function bindModalEvents() {
    const modal = document.getElementById('provinceModal');
    const closeBtn = modal.querySelector('.close');
    const visitedBtn = document.getElementById('visitedBtn');
    const notVisitedBtn = document.getElementById('notVisitedBtn');
    const confirmColorBtn = document.getElementById('confirmColorBtn');
    const cancelColorBtn = document.getElementById('cancelColorBtn');

    closeBtn.addEventListener('click', hideModal);
    window.addEventListener('click', function(event) {
        if (event.target === modal) hideModal();
    });

    visitedBtn.addEventListener('click', showColorPicker);
    notVisitedBtn.addEventListener('click', function() {
        markProvinceAsNotVisited(currentProvince);
        hideModal();
    });

    confirmColorBtn.addEventListener('click', function() {
        markProvinceAsVisited(currentProvince, selectedColor, selectedSeason);
        hideModal();
    });

    cancelColorBtn.addEventListener('click', hideColorPicker);

    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedColor = this.dataset.color;
            selectedSeason = this.dataset.season;
        });
    });
}

function showModal(provinceName) {
    const modal = document.getElementById('provinceModal');
    const modalTitle = document.getElementById('modalTitle');
    modalTitle.textContent = provinceName;
    modal.style.display = 'block';
    hideColorPicker(); 
}

function hideModal() {
    const modal = document.getElementById('provinceModal');
    modal.style.display = 'none';
    hideColorPicker();
}

function showColorPicker() {
    const colorSection = document.getElementById('colorPickerSection');
    colorSection.style.display = 'block';
    
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(opt => opt.classList.remove('selected'));

    const currentData = provinceData[currentProvince];
    let preselectOption = null;

    if (currentData && currentData.visited && currentData.color) {
        preselectOption = Array.from(colorOptions).find(opt => opt.dataset.color === currentData.color);
    }
    
    if (preselectOption) {
        preselectOption.classList.add('selected');
        selectedColor = preselectOption.dataset.color;
        selectedSeason = preselectOption.dataset.season;
    } else {
        const firstColorOption = colorOptions[0];
        if (firstColorOption) {
            firstColorOption.classList.add('selected');
            selectedColor = firstColorOption.dataset.color;
            selectedSeason = firstColorOption.dataset.season;
        } else { 
            selectedColor = '#ff4757'; 
            selectedSeason = 'หน้าร้อน'; 
        }
    }
}

function hideColorPicker() {
    const colorSection = document.getElementById('colorPickerSection');
    colorSection.style.display = 'none';
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(opt => opt.classList.remove('selected'));
}

function markProvinceAsVisited(provinceName, color, season) {
    if (!provinceName || provinceName === 'Unknown Province') return;
    if (!provinceData[provinceName]) provinceData[provinceName] = {};
    
    provinceData[provinceName].visited = true;
    provinceData[provinceName].color = color;
    provinceData[provinceName].season = season || 'ไม่ระบุ';
    provinceData[provinceName].timestamp = new Date().toISOString();
    
    d3.select(`.province[data-province="${provinceName}"]`)
        .style("fill", color)
        .classed("visited", true);
    
    saveProvinceDataToLocalStorage();
    updateStats();
    showNotification(`✅ บันทึก "${provinceName}" สำเร็จ! (ฤดู: ${season})`);
    console.log(`บันทึกข้อมูล: ${provinceName}`, provinceData[provinceName]);
}

function markProvinceAsNotVisited(provinceName) {
    if (!provinceName || provinceName === 'Unknown Province') return;
    if (!provinceData[provinceName]) provinceData[provinceName] = {};

    provinceData[provinceName].visited = false;
    provinceData[provinceName].color = '#ffffff';
    provinceData[provinceName].season = 'ยังไม่ได้ระบุ';
    provinceData[provinceName].timestamp = new Date().toISOString();
    
    d3.select(`.province[data-province="${provinceName}"]`)
        .style("fill", "#ffffff")
        .classed("visited", false);
    
    saveProvinceDataToLocalStorage();
    updateStats();
    showNotification(`ℹ️ รีเซ็ต "${provinceName}" เป็นยังไม่เคยไป`);
    console.log(`รีเซ็ตข้อมูล: ${provinceName}`, provinceData[provinceName]);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2); color: white;
        padding: 12px 20px; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 10000;
        font-size: 14px; font-weight: 500; max-width: 300px;
        transition: all 0.3s ease; transform: translateX(120%);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => { if (notification.parentNode) notification.parentNode.removeChild(notification); }, 300);
    }, 3000);
}
        
function updateStats() {
    const currentMapProvinces = (thailandGeoData && thailandGeoData.features) 
        ? thailandGeoData.features.map(f => getProvinceName(f)).filter(name => name !== 'Unknown Province')
        : [];
    
    const totalProvincesOnMap = new Set(currentMapProvinces).size; // Count unique province names on map

    let visitedCount = 0;
    if (totalProvincesOnMap > 0) {
        currentMapProvinces.forEach(name => {
            if (provinceData[name] && provinceData[name].visited) {
                visitedCount++;
            }
        });
    } else { // If map isn't loaded, count from all known provinceData
         visitedCount = Object.values(provinceData).filter(data => data.visited).length;
    }
            
    const progressPercent = totalProvincesOnMap > 0 ? Math.round((visitedCount / totalProvincesOnMap) * 100) : 0;

    document.getElementById('visitedCount').textContent = visitedCount;
    document.getElementById('totalProvinces').textContent = totalProvincesOnMap > 0 ? totalProvincesOnMap : (Object.keys(provinceData).length || 'N/A');
    document.getElementById('progressPercent').textContent = progressPercent + '%';
}


function showDataSummary() {
    const visitedProvinces = Object.entries(provinceData)
        .filter(([name, data]) => data.visited)
        .sort(([a], [b]) => a.localeCompare(b, 'th'));

    let summary = `🗺️ สรุปข้อมูลการเดินทาง\n`;
    summary += `═══════════════════════\n`;
    summary += `📊 จำนวนจังหวัดที่เคยไป: ${visitedProvinces.length}\n`;
    
    const totalKnownProvinces = Object.keys(provinceData).length;
    if (totalKnownProvinces > 0) {
         summary += `📈 ความคืบหน้า (จากที่รู้จักทั้งหมด ${totalKnownProvinces} จังหวัด): ${Math.round((visitedProvinces.length / totalKnownProvinces) * 100)}%\n\n`;
    } else {
        summary += `\n`;
    }

    if (visitedProvinces.length > 0) {
        summary += `📝 รายชื่อจังหวัดที่เคยไป:\n`;
        summary += `───────────────────────\n`;
        visitedProvinces.forEach(([name, data], index) => {
            const date = data.timestamp ? new Date(data.timestamp).toLocaleDateString('th-TH') : 'N/A';
            summary += `${index + 1}. ${name} - ${data.season || 'ไม่ระบุ'} (บันทึก: ${date})\n`;
        });
    } else {
        summary += `ยังไม่มีข้อมูลการเดินทางที่บันทึกไว้\n`;
    }

    summary += `\n💾 ข้อมูลบันทึกใน Browser (localStorage)\n`;
    alert(summary);
    console.log('🗺️ Thailand Travel Data (from provinceData):', provinceData);
}

function exportData() {
    const dataToExport = {
        exportedAt: new Date().toISOString(),
        provinceData: provinceData,
        summary: {
            totalKnownProvinces: Object.keys(provinceData).length,
            visitedCount: Object.values(provinceData).filter(d => d.visited).length
        }
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thailand-travel-book-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('📁 ส่งออกข้อมูลสำเร็จ!');
}

function clearAllData() {
    if (confirm('⚠️ คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลทั้งหมดที่บันทึกไว้?\n(การกระทำนี้ไม่สามารถย้อนกลับได้)')) {
        const allKnownProvinceNames = new Set();
        
        // Collect names from current GeoData if available
        if (thailandGeoData && thailandGeoData.features) {
             thailandGeoData.features.forEach(feature => {
                const provinceName = getProvinceName(feature);
                if (provinceName && provinceName !== 'Unknown Province') {
                    allKnownProvinceNames.add(provinceName);
                }
            });
        }
        // Also collect names from existing provinceData (localStorage)
        Object.keys(provinceData).forEach(name => allKnownProvinceNames.add(name));

        allKnownProvinceNames.forEach(provinceName => {
            if (!provinceData[provinceName]) provinceData[provinceName] = {}; // Ensure object exists
            provinceData[provinceName].visited = false;
            provinceData[provinceName].color = '#ffffff';
            provinceData[provinceName].season = 'ยังไม่ได้ระบุ';
            provinceData[provinceName].timestamp = new Date().toISOString(); 

            d3.select(`.province[data-province="${provinceName}"]`)
                .style("fill", "#ffffff")
                .classed("visited", false);
        });
        
        saveProvinceDataToLocalStorage();
        updateStats();
        showNotification('🗑️ ลบข้อมูลทั้งหมดเรียบร้อย');
        console.log('🗑️ All data cleared from localStorage and map reset.');
    }
}

window.debugMap = {
    getProvinceData: () => provinceData,
    getThailandGeoData: () => thailandGeoData,
    reloadMap: loadThailandData,
    clearStorage: () => { localStorage.removeItem(LOCAL_STORAGE_KEY); console.log('localStorage cleared.'); location.reload();},
    showStorage: () => console.log(localStorage.getItem(LOCAL_STORAGE_KEY))
};
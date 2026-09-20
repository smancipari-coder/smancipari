// Auto-generated student database from school official reference data
import { StudentClass } from '../types';

export interface RegisteredStudent {
  id: string;
  nis: string;            // 4-digit NIS (e.g. "6418", "6169", "0001", "6701")
  name: string;           // Uppercase official student name
  studentClass: StudentClass; // e.g. '10E1', '10E2', '11F1', '12F1'
  gender: 'L' | 'P';
  nisn?: string;          // Official 10-digit NISN if present
  altNis: string[];       // 4-digit search aliases (padded numbers, raw, sequential, etc.)
  schoolOrigin?: string;
}

export const INITIAL_REGISTERED_STUDENTS: RegisteredStudent[] = [
  {
    "id": "student-11F1-6418-1",
    "nis": "6418",
    "name": "ADIBATUZ ZAKIA",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6418",
      "6418"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6437-2",
    "nis": "6437",
    "name": "ALYA RAHMAWATI",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6437",
      "6437"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6446-3",
    "nis": "6446",
    "name": "ANWAR RIHARDI",
    "studentClass": "11F1",
    "gender": "L",
    "altNis": [
      "6446",
      "6446"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6454-4",
    "nis": "6454",
    "name": "AURELIYA DWI SAPUTRI",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6454",
      "6454"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6458-5",
    "nis": "6458",
    "name": "CAHYO TRI ATMOJO",
    "studentClass": "11F1",
    "gender": "L",
    "altNis": [
      "6458",
      "6458"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6463-6",
    "nis": "6463",
    "name": "DAFA SAPUTRA",
    "studentClass": "11F1",
    "gender": "L",
    "altNis": [
      "6463",
      "6463"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6463-7",
    "nis": "6463",
    "name": "DAMAR ADLY SP",
    "studentClass": "11F1",
    "gender": "L",
    "altNis": [
      "6463",
      "6463"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6469-8",
    "nis": "6469",
    "name": "DESI RATNANINGSIH",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6469",
      "6469"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6472-9",
    "nis": "6472",
    "name": "DIAN PUSPA NINGRUM",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6472",
      "6472"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6479-10",
    "nis": "6479",
    "name": "DWI GUSTI WIDYADHANA",
    "studentClass": "11F1",
    "gender": "L",
    "altNis": [
      "6479",
      "6479"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6481-11",
    "nis": "6481",
    "name": "EKA APRIANI",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6481",
      "6481"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6501-12",
    "nis": "6501",
    "name": "FATAH TRI MAYHENDRA",
    "studentClass": "11F1",
    "gender": "L",
    "altNis": [
      "6501",
      "6501"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6503-13",
    "nis": "6503",
    "name": "FATIMATUS ZUHRO",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6503",
      "6503"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6517-14",
    "nis": "6517",
    "name": "HASYIM FITRIANDANU",
    "studentClass": "11F1",
    "gender": "L",
    "altNis": [
      "6517",
      "6517"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6519-15",
    "nis": "6519",
    "name": "IFA NUR AINI",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6519",
      "6519"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6520-16",
    "nis": "6520",
    "name": "IKA SETIO RINI",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6520",
      "6520"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6523-17",
    "nis": "6523",
    "name": "INTAN FADILLAH",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6523",
      "6523"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6533-18",
    "nis": "6533",
    "name": "KEYVA IRMADELA",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6533",
      "6533"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6543-19",
    "nis": "6543",
    "name": "LISDA MUALIFATUL KHASANAH",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6543",
      "6543"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6559-20",
    "nis": "6559",
    "name": "MUHAMMAD HAMZAH NUR SIDIK",
    "studentClass": "11F1",
    "gender": "L",
    "altNis": [
      "6559",
      "6559"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6565-21",
    "nis": "6565",
    "name": "NABILA NURAINI",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6565",
      "6565"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6566-22",
    "nis": "6566",
    "name": "NABILLA LAILATURIFA AZZAKIYAH",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6566",
      "6566"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6571-23",
    "nis": "6571",
    "name": "NASYWA AZALIA SAMANTA",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6571",
      "6571"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6580-24",
    "nis": "6580",
    "name": "NILA AZ-ZAHRO",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6580",
      "6580"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6586-25",
    "nis": "6586",
    "name": "NUR FAUZIAH",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6586",
      "6586"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6587-26",
    "nis": "6587",
    "name": "NUR HIDAYATUN HAFIZAH",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6587",
      "6587"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6593-27",
    "nis": "6593",
    "name": "PAWESTRI THAHARAH",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6593",
      "6593"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6605-28",
    "nis": "6605",
    "name": "RANDHY TEGAR SAPUTRA",
    "studentClass": "11F1",
    "gender": "L",
    "altNis": [
      "6605",
      "6605"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6608-29",
    "nis": "6608",
    "name": "REVA HABIBAH PUTRI",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6608",
      "6608"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6611-30",
    "nis": "6611",
    "name": "REZA RIFALDI MAULANA",
    "studentClass": "11F1",
    "gender": "L",
    "altNis": [
      "6611",
      "6611"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6612-31",
    "nis": "6612",
    "name": "REZQYTA ERSANIA AZOKA ZURY",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6612",
      "6612"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6614-32",
    "nis": "6614",
    "name": "RINDI ANTIKA DEWI",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6614",
      "6614"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6615-33",
    "nis": "6615",
    "name": "RIRIN TRI LESTARI",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6615",
      "6615"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6627-34",
    "nis": "6627",
    "name": "SUCIATI",
    "studentClass": "11F1",
    "gender": "P",
    "altNis": [
      "6627",
      "6627"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6659-35",
    "nis": "6659",
    "name": "ZAENUL FAHRI",
    "studentClass": "11F1",
    "gender": "L",
    "altNis": [
      "6659",
      "6659"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-11F1-6668-36",
    "nis": "6668",
    "name": "ZULFIAN RISKI S",
    "studentClass": "11F1",
    "gender": "L",
    "altNis": [
      "6668",
      "6668"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6169-1",
    "nis": "6169",
    "name": "ADITYA DWI SAPUTRA",
    "studentClass": "12F1",
    "gender": "L",
    "nisn": "0095468429",
    "altNis": [
      "6169",
      "6169",
      "8429"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6176-2",
    "nis": "6176",
    "name": "ALFA RIZKY MARGARETA",
    "studentClass": "12F1",
    "gender": "L",
    "nisn": "0095131588",
    "altNis": [
      "6176",
      "6176",
      "1588"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6181-3",
    "nis": "6181",
    "name": "ALIFAN GUNTORO",
    "studentClass": "12F1",
    "gender": "L",
    "nisn": "0082527292",
    "altNis": [
      "6181",
      "6181",
      "7292"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6185-4",
    "nis": "6185",
    "name": "AMANDA LUTFIANA",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "0097924463",
    "altNis": [
      "6185",
      "6185",
      "4463"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6190-5",
    "nis": "6190",
    "name": "ANIATUL MUSRIFAH",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "009585402",
    "altNis": [
      "6190",
      "6190",
      "5402"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6195-6",
    "nis": "6195",
    "name": "APRILLIA RIZKA PANGESTI",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "0102047107",
    "altNis": [
      "6195",
      "6195",
      "7107"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6196-7",
    "nis": "6196",
    "name": "ARIF TEGAR JAYA",
    "studentClass": "12F1",
    "gender": "L",
    "nisn": "0092258401",
    "altNis": [
      "6196",
      "6196",
      "8401"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6197-8",
    "nis": "6197",
    "name": "ARINAL HUSNA",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "0094728409",
    "altNis": [
      "6197",
      "6197",
      "8409"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6205-9",
    "nis": "6205",
    "name": "AURA LUTHFIA NINGSIH",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "0094753708",
    "altNis": [
      "6205",
      "6205",
      "3708"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6207-10",
    "nis": "6207",
    "name": "AYU FADILATUL KHASANAH",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "0088338975",
    "altNis": [
      "6207",
      "6207",
      "8975"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6415-11",
    "nis": "6415",
    "name": "CHALISA FEBIANA",
    "studentClass": "12F1",
    "gender": "P",
    "altNis": [
      "6415",
      "6415"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6231-12",
    "nis": "6231",
    "name": "DEVITA MEI ZAHRANI",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "3091834112",
    "altNis": [
      "6231",
      "6231",
      "4112"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6252-13",
    "nis": "6252",
    "name": "FAQIHUL AMAM",
    "studentClass": "12F1",
    "gender": "L",
    "nisn": "0087740484",
    "altNis": [
      "6252",
      "6252",
      "0484"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6265-14",
    "nis": "6265",
    "name": "GHANIY JULIAN ADHYAKSA",
    "studentClass": "12F1",
    "gender": "L",
    "nisn": "0092954880",
    "altNis": [
      "6265",
      "6265",
      "4880"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6268-15",
    "nis": "6268",
    "name": "HELLENA AFAREL",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "3082348357",
    "altNis": [
      "6268",
      "6268",
      "8357"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6270-16",
    "nis": "6270",
    "name": "HEMAS CITRA WIGUNA",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "0092056974",
    "altNis": [
      "6270",
      "6270",
      "6974"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6285-17",
    "nis": "6285",
    "name": "INTAN SAFITRI",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "0093072006",
    "altNis": [
      "6285",
      "6285",
      "2006"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6290-18",
    "nis": "6290",
    "name": "KAYLA KHANZA KIRANA",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "3083448291",
    "altNis": [
      "6290",
      "6290",
      "8291"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6304-19",
    "nis": "6304",
    "name": "MARISA MAULANI",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "0093838739",
    "altNis": [
      "6304",
      "6304",
      "8739"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6312-20",
    "nis": "6312",
    "name": "MITALIA EKA SANTI",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "0091271123",
    "altNis": [
      "6312",
      "6312",
      "1123"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6313-21",
    "nis": "6313",
    "name": "MUHAMAD AZKIYA RAMADHAN",
    "studentClass": "12F1",
    "gender": "L",
    "nisn": "0091821259",
    "altNis": [
      "6313",
      "6313",
      "1259"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6477-22",
    "nis": "6477",
    "name": "MUHAMAD ULIN NUHA",
    "studentClass": "12F1",
    "gender": "L",
    "nisn": "0097538755",
    "altNis": [
      "6477",
      "6477",
      "8755"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6322-23",
    "nis": "6322",
    "name": "MUTMAINAH",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "3108042720",
    "altNis": [
      "6322",
      "6322",
      "2720"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6326-24",
    "nis": "6326",
    "name": "NAELA ALIFAH",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "3099389834",
    "altNis": [
      "6326",
      "6326",
      "9834"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6331-25",
    "nis": "6331",
    "name": "NANDA DESVITA",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "0099185330",
    "altNis": [
      "6331",
      "6331",
      "5330"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6338-26",
    "nis": "6338",
    "name": "NOFA PURBASARI",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "0086325197",
    "altNis": [
      "6338",
      "6338",
      "5197"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6342-27",
    "nis": "6342",
    "name": "PRATIWI DWI ARISTA AYU",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "0094987659",
    "altNis": [
      "6342",
      "6342",
      "7659"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6358-28",
    "nis": "6358",
    "name": "RIANA PUTRI PAMUNGKAS",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "0088639386",
    "altNis": [
      "6358",
      "6358",
      "9386"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6373-29",
    "nis": "6373",
    "name": "SEKAR WIDIYAWATI",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "0098313464",
    "altNis": [
      "6373",
      "6373",
      "3464"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6378-30",
    "nis": "6378",
    "name": "SHIFA ANANTA",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "0099597258",
    "altNis": [
      "6378",
      "6378",
      "7258"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6386-31",
    "nis": "6386",
    "name": "SIVA ARIANI JENIAR PRAMONO",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "0093353963",
    "altNis": [
      "6386",
      "6386",
      "3963"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6391-32",
    "nis": "6391",
    "name": "SYIFAATUR RIYADHAH",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "0098617830",
    "altNis": [
      "6391",
      "6391",
      "7830"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-12F1-6410-33",
    "nis": "6410",
    "name": "ZAHRA TUSSITA",
    "studentClass": "12F1",
    "gender": "P",
    "nisn": "0093406305",
    "altNis": [
      "6410",
      "6410",
      "6305"
    ],
    "schoolOrigin": "SMA Negeri 1 Cipari"
  },
  {
    "id": "student-10E1-0001",
    "nis": "0001",
    "name": "ABDUL AZZIS",
    "studentClass": "10E1",
    "gender": "L",
    "nisn": "0114333239",
    "altNis": [
      "0001",
      "1",
      "6669",
      "3239"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E1-0002",
    "nis": "0002",
    "name": "AKHMAD NUR SYARIF",
    "studentClass": "10E1",
    "gender": "L",
    "nisn": "0111933349",
    "altNis": [
      "0002",
      "2",
      "6670",
      "3349"
    ],
    "schoolOrigin": "SMP AL ANWAR"
  },
  {
    "id": "student-10E1-0003",
    "nis": "0003",
    "name": "AMIROTUL FARIQOH",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "3097029314",
    "altNis": [
      "0003",
      "3",
      "6671",
      "9314"
    ],
    "schoolOrigin": "MTs MA`ARIF NU 01 Sidareja"
  },
  {
    "id": "student-10E1-0004",
    "nis": "0004",
    "name": "ANDINI PUSPITA OKTAVIANI",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "0114915906",
    "altNis": [
      "0004",
      "4",
      "6672",
      "5906"
    ],
    "schoolOrigin": "SMP NEGERI 2 SIDAREJA"
  },
  {
    "id": "student-10E1-0005",
    "nis": "0005",
    "name": "ANESA DARA SEKAR ARUM",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "0115635514",
    "altNis": [
      "0005",
      "5",
      "6673",
      "5514"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E1-0006",
    "nis": "0006",
    "name": "BIMA ABDUL MALIK",
    "studentClass": "10E1",
    "gender": "L",
    "nisn": "0115901775",
    "altNis": [
      "0006",
      "6",
      "6674",
      "1775"
    ],
    "schoolOrigin": "SMP IT BINA INSAN KAMIL SIDAREJA"
  },
  {
    "id": "student-10E1-0007",
    "nis": "0007",
    "name": "DWI NOFITA SARI",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "3112642590",
    "altNis": [
      "0007",
      "7",
      "6675",
      "2590"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E1-0008",
    "nis": "0008",
    "name": "ELFINA KHOERIYATUNNISA",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "0107017371",
    "altNis": [
      "0008",
      "8",
      "6676",
      "7371"
    ],
    "schoolOrigin": "MTSS MAFATIHUL HUDA"
  },
  {
    "id": "student-10E1-0009",
    "nis": "0009",
    "name": "FATHAN YANUAR ANWAR",
    "studentClass": "10E1",
    "gender": "L",
    "nisn": "3113156326",
    "altNis": [
      "0009",
      "9",
      "6677",
      "6326"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E1-0010",
    "nis": "0010",
    "name": "HANIN UKHTI SABRINA",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "0118714112",
    "altNis": [
      "0010",
      "10",
      "6678",
      "4112"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E1-0011",
    "nis": "0011",
    "name": "HAYKAL FIRANT ARIAN",
    "studentClass": "10E1",
    "gender": "L",
    "nisn": "0109371205",
    "altNis": [
      "0011",
      "11",
      "6679",
      "1205"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E1-0012",
    "nis": "0012",
    "name": "ILHAM AL FAHMI",
    "studentClass": "10E1",
    "gender": "L",
    "nisn": "0118661875",
    "altNis": [
      "0012",
      "12",
      "6680",
      "1875"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E1-0013",
    "nis": "0013",
    "name": "JESSICA EFENDI",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "0115006128",
    "altNis": [
      "0013",
      "13",
      "6681",
      "6128"
    ],
    "schoolOrigin": "SMP NEGERI 2 KEDUNGREJA"
  },
  {
    "id": "student-10E1-0014",
    "nis": "0014",
    "name": "KARTIKA SARI DEWI",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "0118544624",
    "altNis": [
      "0014",
      "14",
      "6682",
      "4624"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E1-0015",
    "nis": "0015",
    "name": "KHOERUNISA",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "0111913664",
    "altNis": [
      "0015",
      "15",
      "6683",
      "3664"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E1-0016",
    "nis": "0016",
    "name": "MAFELA INEZ CAHYA DEWI",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "0121796097",
    "altNis": [
      "0016",
      "16",
      "6684",
      "6097"
    ],
    "schoolOrigin": "SMP NEGERI 1 WANAREJA"
  },
  {
    "id": "student-10E1-0017",
    "nis": "0017",
    "name": "MULYANI NOVELIA",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "3117174549",
    "altNis": [
      "0017",
      "17",
      "6685",
      "4549"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E1-0018",
    "nis": "0018",
    "name": "NAJWA AINURROHMAH",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "0113867778",
    "altNis": [
      "0018",
      "18",
      "6686",
      "7778"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E1-0019",
    "nis": "0019",
    "name": "NAYLA PUTRI CAHAYATI",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "3116538803",
    "altNis": [
      "0019",
      "19",
      "6687",
      "8803"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E1-0020",
    "nis": "0020",
    "name": "NESYA VERONICA",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "0106511303",
    "altNis": [
      "0020",
      "20",
      "6688",
      "1303"
    ],
    "schoolOrigin": "MTSS MAFATIHUL HUDA"
  },
  {
    "id": "student-10E1-0021",
    "nis": "0021",
    "name": "NOVENTA LISTYANA",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "0108808378",
    "altNis": [
      "0021",
      "21",
      "6689",
      "8378"
    ],
    "schoolOrigin": "SMP NEGERI 2 MAJENANG"
  },
  {
    "id": "student-10E1-0022",
    "nis": "0022",
    "name": "QONI ATUR RAHMAH",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "0115974765",
    "altNis": [
      "0022",
      "22",
      "6690",
      "4765"
    ],
    "schoolOrigin": "SMP NEGERI 3 KEDUNGREJA"
  },
  {
    "id": "student-10E1-0023",
    "nis": "0023",
    "name": "RAHMATUL LAILIAH",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "0098408026",
    "altNis": [
      "0023",
      "23",
      "6691",
      "8026"
    ],
    "schoolOrigin": "SMP NEGERI 2 CIPARI"
  },
  {
    "id": "student-10E1-0024",
    "nis": "0024",
    "name": "RASYA SYAFIRA PUTRI ROSADI",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "0113056839",
    "altNis": [
      "0024",
      "24",
      "6692",
      "6839"
    ],
    "schoolOrigin": "SMP NEGERI 1 SIDAREJA"
  },
  {
    "id": "student-10E1-0025",
    "nis": "0025",
    "name": "REHANDY ALAMSYAH",
    "studentClass": "10E1",
    "gender": "L",
    "nisn": "0119621642",
    "altNis": [
      "0025",
      "25",
      "6693",
      "1642"
    ],
    "schoolOrigin": "MTSS DARUL ULUM CIPARI"
  },
  {
    "id": "student-10E1-0026",
    "nis": "0026",
    "name": "RISNO",
    "studentClass": "10E1",
    "gender": "L",
    "nisn": "0109374953",
    "altNis": [
      "0026",
      "26",
      "6694",
      "4953"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E1-0027",
    "nis": "0027",
    "name": "RIZKA AZILLIA NUR RAHMAH",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "0103807370",
    "altNis": [
      "0027",
      "27",
      "6695",
      "7370"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E1-0028",
    "nis": "0028",
    "name": "TIARA JUNIATI",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "0116530187",
    "altNis": [
      "0028",
      "28",
      "6696",
      "0187"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E1-0029",
    "nis": "0029",
    "name": "TRIVIA ZULVI RANDITA SARI",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "0106168064",
    "altNis": [
      "0029",
      "29",
      "6697",
      "8064"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E1-0030",
    "nis": "0030",
    "name": "UMAM NURDIANSYAH",
    "studentClass": "10E1",
    "gender": "L",
    "nisn": "0114463326",
    "altNis": [
      "0030",
      "30",
      "6698",
      "3326"
    ],
    "schoolOrigin": "SMP NEGERI 2 CIPARI"
  },
  {
    "id": "student-10E1-0031",
    "nis": "0031",
    "name": "USYFATUL JANNAH",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "3111965544",
    "altNis": [
      "0031",
      "31",
      "6699",
      "5544"
    ],
    "schoolOrigin": "SMP AL ISLAM CIPARI"
  },
  {
    "id": "student-10E1-0032",
    "nis": "0032",
    "name": "VENI NUR FATIMAH",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "0106670024",
    "altNis": [
      "0032",
      "32",
      "6700",
      "0024"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E1-0033",
    "nis": "0033",
    "name": "WAHYUNI ALVIKANIYA",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "3122592663",
    "altNis": [
      "0033",
      "33",
      "6701",
      "2663"
    ],
    "schoolOrigin": "SMP MAARIF NU 1 WANAREJA"
  },
  {
    "id": "student-10E1-0034",
    "nis": "0034",
    "name": "WAHYUNI NOVA SARI",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "0118330970",
    "altNis": [
      "0034",
      "34",
      "6702",
      "0970"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E1-0035",
    "nis": "0035",
    "name": "YOHANA ALINA KRISTI",
    "studentClass": "10E1",
    "gender": "P",
    "nisn": "0101580904",
    "altNis": [
      "0035",
      "35",
      "6703",
      "0904"
    ],
    "schoolOrigin": "SMP NEGERI 1 MAJENANG"
  },
  {
    "id": "student-10E1-0036",
    "nis": "0036",
    "name": "YOVA JUNIUS",
    "studentClass": "10E1",
    "gender": "L",
    "nisn": "0084392339",
    "altNis": [
      "0036",
      "36",
      "6704",
      "2339"
    ],
    "schoolOrigin": "SMP PGRI 7 WANAREJA"
  },
  {
    "id": "student-10E2-0037",
    "nis": "0037",
    "name": "ABDUL BASITH ALHAJ",
    "studentClass": "10E2",
    "gender": "L",
    "nisn": "0111494231",
    "altNis": [
      "0037",
      "37",
      "6705",
      "4231"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E2-0038",
    "nis": "0038",
    "name": "ADITYA REIYAN AINNUROCHMAN",
    "studentClass": "10E2",
    "gender": "L",
    "nisn": "0117714131",
    "altNis": [
      "0038",
      "38",
      "6706",
      "4131"
    ],
    "schoolOrigin": "SMP AL ISLAM CIPARI"
  },
  {
    "id": "student-10E2-0039",
    "nis": "0039",
    "name": "ANGGIE NOVITASHELA",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "0113635682",
    "altNis": [
      "0039",
      "39",
      "6707",
      "5682"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E2-0040",
    "nis": "0040",
    "name": "ANJAR FALIHATIN ARSYADA",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "0115772552",
    "altNis": [
      "0040",
      "40",
      "6708",
      "2552"
    ],
    "schoolOrigin": "MTSS ELL FIRDAUS 01"
  },
  {
    "id": "student-10E2-0041",
    "nis": "0041",
    "name": "ARINA GIVTIA",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "0112152361",
    "altNis": [
      "0041",
      "41",
      "6709",
      "2361"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E2-0042",
    "nis": "0042",
    "name": "ASTI PRAJNA ANDINI",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "0116761432",
    "altNis": [
      "0042",
      "42",
      "6710",
      "1432"
    ],
    "schoolOrigin": "SMP NEGERI 1 SIDAREJA"
  },
  {
    "id": "student-10E2-0043",
    "nis": "0043",
    "name": "BAGUS RAMADHANI",
    "studentClass": "10E2",
    "gender": "L",
    "nisn": "0117563260",
    "altNis": [
      "0043",
      "43",
      "6711",
      "3260"
    ],
    "schoolOrigin": "SMP NEGERI 3 SATAP CIPARI"
  },
  {
    "id": "student-10E2-0044",
    "nis": "0044",
    "name": "BILQIS KHOLIFAH",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "0114489308",
    "altNis": [
      "0044",
      "44",
      "6712",
      "9308"
    ],
    "schoolOrigin": "SMP NEGERI 3 SATAP CIPARI"
  },
  {
    "id": "student-10E2-0045",
    "nis": "0045",
    "name": "DELLA TRI TASYA",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "0113090559",
    "altNis": [
      "0045",
      "45",
      "6713",
      "0559"
    ],
    "schoolOrigin": "MTSS MINAT"
  },
  {
    "id": "student-10E2-0046",
    "nis": "0046",
    "name": "ELIZZAH AULIA TAUFIQ",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "0111680907",
    "altNis": [
      "0046",
      "46",
      "6714",
      "0907"
    ],
    "schoolOrigin": "SMP IT BINA INSAN KAMIL SIDAREJA"
  },
  {
    "id": "student-10E2-0047",
    "nis": "0047",
    "name": "FATMA LESTARI",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "3119689438",
    "altNis": [
      "0047",
      "47",
      "6715",
      "9438"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E2-0048",
    "nis": "0048",
    "name": "GALANG ADIWITYA",
    "studentClass": "10E2",
    "gender": "L",
    "nisn": "0114586579",
    "altNis": [
      "0048",
      "48",
      "6716",
      "6579"
    ],
    "schoolOrigin": "SMP NEGERI 2 KEDUNGREJA"
  },
  {
    "id": "student-10E2-0049",
    "nis": "0049",
    "name": "HUSNA AWALIYAH",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "0118543848",
    "altNis": [
      "0049",
      "49",
      "6717",
      "3848"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E2-0050",
    "nis": "0050",
    "name": "ISNAENY ABABIEL MUMTAZA",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "3111726857",
    "altNis": [
      "0050",
      "50",
      "6718",
      "6857"
    ],
    "schoolOrigin": "MTSS MAFATIHUL HUDA"
  },
  {
    "id": "student-10E2-0051",
    "nis": "0051",
    "name": "KAAFIN MUSYAFA",
    "studentClass": "10E2",
    "gender": "L",
    "nisn": "0105343033",
    "altNis": [
      "0051",
      "51",
      "6719",
      "3033"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E2-0052",
    "nis": "0052",
    "name": "KAIN DEKA GUNAWAN PRATAMA",
    "studentClass": "10E2",
    "gender": "L",
    "nisn": "0101825866",
    "altNis": [
      "0052",
      "52",
      "6720",
      "5866"
    ],
    "schoolOrigin": "SMP IT BINA INSAN KAMIL SIDAREJA"
  },
  {
    "id": "student-10E2-0053",
    "nis": "0053",
    "name": "KIKI NOVRY ABIYANSYAH",
    "studentClass": "10E2",
    "gender": "L",
    "nisn": "0092142744",
    "altNis": [
      "0053",
      "53",
      "6721",
      "2744"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E2-0054",
    "nis": "0054",
    "name": "KULYATI",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "0109503949",
    "altNis": [
      "0054",
      "54",
      "6722",
      "3949"
    ],
    "schoolOrigin": "SMP NEGERI 1 SIDAREJA"
  },
  {
    "id": "student-10E2-0055",
    "nis": "0055",
    "name": "META TRI JULIANA",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "0103640687",
    "altNis": [
      "0055",
      "55",
      "6723",
      "0687"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E2-0056",
    "nis": "0056",
    "name": "MUHAMAD IKHSAN MUZAKI",
    "studentClass": "10E2",
    "gender": "L",
    "nisn": "0112120042",
    "altNis": [
      "0056",
      "56",
      "6724",
      "0042"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E2-0057",
    "nis": "0057",
    "name": "NAURAH KHALILAH ALMAASAH",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "0117196387",
    "altNis": [
      "0057",
      "57",
      "6725",
      "6387"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E2-0058",
    "nis": "0058",
    "name": "NAYSHILA GARNISH IRENIZA",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "0116670649",
    "altNis": [
      "0058",
      "58",
      "6726",
      "0649"
    ],
    "schoolOrigin": "SMP NEGERI 1 BANTARSARI"
  },
  {
    "id": "student-10E2-0059",
    "nis": "0059",
    "name": "NAZWA NAYRA PUTRI",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "0107512100",
    "altNis": [
      "0059",
      "59",
      "6727",
      "2100"
    ],
    "schoolOrigin": "SMP NEGERI 3 SATAP CIPARI"
  },
  {
    "id": "student-10E2-0060",
    "nis": "0060",
    "name": "NINDITA QOTRUNNADA",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "0118829692",
    "altNis": [
      "0060",
      "60",
      "6728",
      "9692"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E2-0061",
    "nis": "0061",
    "name": "PARRISFANTI",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "0111709603",
    "altNis": [
      "0061",
      "61",
      "6729",
      "9603"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E2-0062",
    "nis": "0062",
    "name": "RAHMAH NUR KHANIFAH",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "0111499949",
    "altNis": [
      "0062",
      "62",
      "6730",
      "9949"
    ],
    "schoolOrigin": "SMP NEGERI 1 SIDAREJA"
  },
  {
    "id": "student-10E2-0063",
    "nis": "0063",
    "name": "RISMA AYU SAPUTRI",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "0118112125",
    "altNis": [
      "0063",
      "63",
      "6731",
      "2125"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E2-0064",
    "nis": "0064",
    "name": "SAQINAH AZALEA NUROHMAN",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "0116191272",
    "altNis": [
      "0064",
      "64",
      "6732",
      "1272"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E2-0065",
    "nis": "0065",
    "name": "SATRIA KEZZA PRATAMA HALIM",
    "studentClass": "10E2",
    "gender": "L",
    "nisn": "0115275702",
    "altNis": [
      "0065",
      "65",
      "6733",
      "5702"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E2-0066",
    "nis": "0066",
    "name": "SYIHAB IBNU MUBAROK",
    "studentClass": "10E2",
    "gender": "L",
    "nisn": "0112670261",
    "altNis": [
      "0066",
      "66",
      "6734",
      "0261"
    ],
    "schoolOrigin": "MTSS DARUL ULUM 2"
  },
  {
    "id": "student-10E2-0067",
    "nis": "0067",
    "name": "TIARA",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "0091271125",
    "altNis": [
      "0067",
      "67",
      "6735",
      "1125"
    ],
    "schoolOrigin": "SMP NEGERI 2 CIPARI"
  },
  {
    "id": "student-10E2-0068",
    "nis": "0068",
    "name": "ULFAH FAUZIYYAH",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "0103017467",
    "altNis": [
      "0068",
      "68",
      "6736",
      "7467"
    ],
    "schoolOrigin": "SMP NEGERI 1 WANAREJA"
  },
  {
    "id": "student-10E2-0069",
    "nis": "0069",
    "name": "VYOLLA QEANA ATMAJA",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "0113343460",
    "altNis": [
      "0069",
      "69",
      "6737",
      "3460"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E2-0070",
    "nis": "0070",
    "name": "WAFA AZIZAH RAMADHANI",
    "studentClass": "10E2",
    "gender": "P",
    "nisn": "3117565688",
    "altNis": [
      "0070",
      "70",
      "6738",
      "5688"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E2-0071",
    "nis": "0071",
    "name": "WILDAN CESAR SUBEKTI",
    "studentClass": "10E2",
    "gender": "L",
    "nisn": "0119619307",
    "altNis": [
      "0071",
      "71",
      "6739",
      "9307"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E2-0072",
    "nis": "0072",
    "name": "ZAM ZAM ZAKARIA FRANSISKO",
    "studentClass": "10E2",
    "gender": "L",
    "nisn": "0116280464",
    "altNis": [
      "0072",
      "72",
      "6740",
      "0464"
    ],
    "schoolOrigin": "SMP NEGERI 2 KARANGPUCUNG"
  },
  {
    "id": "student-10E3-0073",
    "nis": "0073",
    "name": "ADITYA SUKMANA",
    "studentClass": "10E3",
    "gender": "L",
    "nisn": "0112815187",
    "altNis": [
      "0073",
      "73",
      "6741",
      "5187"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E3-0074",
    "nis": "0074",
    "name": "AHMAD BARLANA",
    "studentClass": "10E3",
    "gender": "L",
    "nisn": "3128694336",
    "altNis": [
      "0074",
      "74",
      "6742",
      "4336"
    ],
    "schoolOrigin": "SMP AL ISLAM CIPARI"
  },
  {
    "id": "student-10E3-0075",
    "nis": "0075",
    "name": "ANGGI IRFANGI",
    "studentClass": "10E3",
    "gender": "L",
    "nisn": "0081468597",
    "altNis": [
      "0075",
      "75",
      "6743",
      "8597"
    ],
    "schoolOrigin": "MTSS DARUL ULUM CIPARI"
  },
  {
    "id": "student-10E3-0076",
    "nis": "0076",
    "name": "ANTON SETIAWAN",
    "studentClass": "10E3",
    "gender": "L",
    "nisn": "0114267301",
    "altNis": [
      "0076",
      "76",
      "6744",
      "7301"
    ],
    "schoolOrigin": "SMP NEGERI 2 SIDAREJA"
  },
  {
    "id": "student-10E3-0077",
    "nis": "0077",
    "name": "ASSIFA SALMA KHOFIFAH",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0116781441",
    "altNis": [
      "0077",
      "77",
      "6745",
      "1441"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E3-0078",
    "nis": "0078",
    "name": "ASTI PRATAMA",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0116990526",
    "altNis": [
      "0078",
      "78",
      "6746",
      "0526"
    ],
    "schoolOrigin": "MTSS SALAFIYAH"
  },
  {
    "id": "student-10E3-0079",
    "nis": "0079",
    "name": "ATIKA SALSABILA ROSIANA",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "3117978440",
    "altNis": [
      "0079",
      "79",
      "6747",
      "8440"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E3-0080",
    "nis": "0080",
    "name": "BERLIANA BESTYA ARDANI",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0112330158",
    "altNis": [
      "0080",
      "80",
      "6748",
      "0158"
    ],
    "schoolOrigin": "SMP NEGERI 1 WANAREJA"
  },
  {
    "id": "student-10E3-0081",
    "nis": "0081",
    "name": "BUNGA CINTA RISMAWATI",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0119079815",
    "altNis": [
      "0081",
      "81",
      "6749",
      "9815"
    ],
    "schoolOrigin": "SMP NEGERI 2 SIDAREJA"
  },
  {
    "id": "student-10E3-0082",
    "nis": "0082",
    "name": "CICIH YULIYANI",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0104779582",
    "altNis": [
      "0082",
      "82",
      "6750",
      "9582"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E3-0083",
    "nis": "0083",
    "name": "FIDA TRI LESTARI",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0119579163",
    "altNis": [
      "0083",
      "83",
      "6751",
      "9163"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E3-0084",
    "nis": "0084",
    "name": "INTAN ANDHINI",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0116144207",
    "altNis": [
      "0084",
      "84",
      "6752",
      "4207"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E3-0085",
    "nis": "0085",
    "name": "JIANDRA KUSUMASTUTI",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0118274799",
    "altNis": [
      "0085",
      "85",
      "6753",
      "4799"
    ],
    "schoolOrigin": "SMP NEGERI 2 CIPARI"
  },
  {
    "id": "student-10E3-0086",
    "nis": "0086",
    "name": "KINANTI SUCIATI",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0112475574",
    "altNis": [
      "0086",
      "86",
      "6754",
      "5574"
    ],
    "schoolOrigin": "SMP PGRI 7 WANAREJA"
  },
  {
    "id": "student-10E3-0087",
    "nis": "0087",
    "name": "LAKHFAH AZMI EL SYAIROZI",
    "studentClass": "10E3",
    "gender": "L",
    "nisn": "0114335757",
    "altNis": [
      "0087",
      "87",
      "6755",
      "5757"
    ],
    "schoolOrigin": "SMP IT BINA INSAN KAMIL SIDAREJA"
  },
  {
    "id": "student-10E3-0088",
    "nis": "0088",
    "name": "MAHARDIKA LINTANG RAMADHAN",
    "studentClass": "10E3",
    "gender": "L",
    "nisn": "0118255019",
    "altNis": [
      "0088",
      "88",
      "6756",
      "5019"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E3-0089",
    "nis": "0089",
    "name": "MAURA YAZMIN RIHAN",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "3119559270",
    "altNis": [
      "0089",
      "89",
      "6757",
      "9270"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E3-0090",
    "nis": "0090",
    "name": "MUHAMAD FATHIR RIZKY RAMADHAN",
    "studentClass": "10E3",
    "gender": "L",
    "nisn": "0106391481",
    "altNis": [
      "0090",
      "90",
      "6758",
      "1481"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E3-0091",
    "nis": "0091",
    "name": "NIKEN KEYKO",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0101618566",
    "altNis": [
      "0091",
      "91",
      "6759",
      "8566"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E3-0092",
    "nis": "0092",
    "name": "NIVIA FAIDAH",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0086696775",
    "altNis": [
      "0092",
      "92",
      "6760",
      "6775"
    ],
    "schoolOrigin": "MTS MAARIF WANAREJA"
  },
  {
    "id": "student-10E3-0093",
    "nis": "0093",
    "name": "PRICILIA FEBRIANA PUTRI",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0114406419",
    "altNis": [
      "0093",
      "93",
      "6761",
      "6419"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E3-0094",
    "nis": "0094",
    "name": "REFINA ATHA NANDYA",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0103323768",
    "altNis": [
      "0094",
      "94",
      "6762",
      "3768"
    ],
    "schoolOrigin": "SMP NEGERI 3 SIDAREJA"
  },
  {
    "id": "student-10E3-0095",
    "nis": "0095",
    "name": "REGINA TRI AMANDA",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0111814477",
    "altNis": [
      "0095",
      "95",
      "6763",
      "4477"
    ],
    "schoolOrigin": "SMP IT BINA INSAN KAMIL SIDAREJA"
  },
  {
    "id": "student-10E3-0096",
    "nis": "0096",
    "name": "RENDI FEBIAN WICAKSONO",
    "studentClass": "10E3",
    "gender": "L",
    "nisn": "0111263380",
    "altNis": [
      "0096",
      "96",
      "6764",
      "3380"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E3-0097",
    "nis": "0097",
    "name": "RISTY AYU NAYSHILA",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0119121020",
    "altNis": [
      "0097",
      "97",
      "6765",
      "1020"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E3-0098",
    "nis": "0098",
    "name": "RIZKA SALSABILA",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0102100355",
    "altNis": [
      "0098",
      "98",
      "6766",
      "0355"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E3-0099",
    "nis": "0099",
    "name": "ROFIQOH AULIA PERTIWI",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0104934530",
    "altNis": [
      "0099",
      "99",
      "6767",
      "4530"
    ],
    "schoolOrigin": "SMP NEGERI 1 SIDAREJA"
  },
  {
    "id": "student-10E3-0100",
    "nis": "0100",
    "name": "SHAFA APRILIA",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "3113025833",
    "altNis": [
      "0100",
      "100",
      "6768",
      "5833"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E3-0101",
    "nis": "0101",
    "name": "SITI GENDIS SAPUTRI",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0117741857",
    "altNis": [
      "0101",
      "101",
      "6769",
      "1857"
    ],
    "schoolOrigin": "MTSS MAFATIHUL HUDA"
  },
  {
    "id": "student-10E3-0102",
    "nis": "0102",
    "name": "VANI LESTARI",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0104787800",
    "altNis": [
      "0102",
      "102",
      "6770",
      "7800"
    ],
    "schoolOrigin": "SMP NEGERI 2 CIPARI"
  },
  {
    "id": "student-10E3-0103",
    "nis": "0103",
    "name": "VIAN BANGKIT PRATAMA",
    "studentClass": "10E3",
    "gender": "L",
    "nisn": "0113901976",
    "altNis": [
      "0103",
      "103",
      "6771",
      "1976"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E3-0104",
    "nis": "0104",
    "name": "WAHYU HARDIANTO",
    "studentClass": "10E3",
    "gender": "L",
    "nisn": "0111951395",
    "altNis": [
      "0104",
      "104",
      "6772",
      "1395"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E3-0105",
    "nis": "0105",
    "name": "WIDHYA ROHADATUL AISY",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0112799117",
    "altNis": [
      "0105",
      "105",
      "6773",
      "9117"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E3-0106",
    "nis": "0106",
    "name": "WINDIRA ALDA TAN BILBINA",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0114752575",
    "altNis": [
      "0106",
      "106",
      "6774",
      "2575"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E3-0107",
    "nis": "0107",
    "name": "ZALIKA ZAIDA NISRINA",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0112211353",
    "altNis": [
      "0107",
      "107",
      "6775",
      "1353"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E3-0108",
    "nis": "0108",
    "name": "ZULFA HANIFAH ANUGERAH",
    "studentClass": "10E3",
    "gender": "P",
    "nisn": "0114493079",
    "altNis": [
      "0108",
      "108",
      "6776",
      "3079"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E4-0109",
    "nis": "0109",
    "name": "AHMAD RIZKI ANUGRAH",
    "studentClass": "10E4",
    "gender": "L",
    "nisn": "3114886560",
    "altNis": [
      "0109",
      "109",
      "6777",
      "6560"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E4-0110",
    "nis": "0110",
    "name": "ARYO LINGSANG WITANA",
    "studentClass": "10E4",
    "gender": "L",
    "nisn": "0119959790",
    "altNis": [
      "0110",
      "110",
      "6778",
      "9790"
    ],
    "schoolOrigin": "SMP NEGERI 2 CIPARI"
  },
  {
    "id": "student-10E4-0111",
    "nis": "0111",
    "name": "ASYIFAH NURHASANAH",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0107750287",
    "altNis": [
      "0111",
      "111",
      "6779",
      "0287"
    ],
    "schoolOrigin": "SMP NEGERI 2 KARANGPUCUNG"
  },
  {
    "id": "student-10E4-0112",
    "nis": "0112",
    "name": "AVRIEL AMBAR LESTARI",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0111682219",
    "altNis": [
      "0112",
      "112",
      "6780",
      "2219"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E4-0113",
    "nis": "0113",
    "name": "DEVITA PUTRI ANJANI",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0115798146",
    "altNis": [
      "0113",
      "113",
      "6781",
      "8146"
    ],
    "schoolOrigin": "SMP NEGERI 2 CIPARI"
  },
  {
    "id": "student-10E4-0114",
    "nis": "0114",
    "name": "DZAKY SHIDQ DINOTO",
    "studentClass": "10E4",
    "gender": "L",
    "nisn": "0118038592",
    "altNis": [
      "0114",
      "114",
      "6782",
      "8592"
    ],
    "schoolOrigin": "SMP MUHAMMADIYAH 3 KARANGPUCUNG"
  },
  {
    "id": "student-10E4-0115",
    "nis": "0115",
    "name": "ELSA NUR AMANI",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0117334935",
    "altNis": [
      "0115",
      "115",
      "6783",
      "4935"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E4-0116",
    "nis": "0116",
    "name": "EVA KHILATUL KHOLIDA",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0115739486",
    "altNis": [
      "0116",
      "116",
      "6784",
      "9486"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E4-0117",
    "nis": "0117",
    "name": "FEBRI LUSI INDRIANI",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "3109851087",
    "altNis": [
      "0117",
      "117",
      "6785",
      "1087"
    ],
    "schoolOrigin": "MTs PESANTREN PEMBANGUNAN MAJENANG"
  },
  {
    "id": "student-10E4-0118",
    "nis": "0118",
    "name": "FITRIA NINGSIH",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0117564054",
    "altNis": [
      "0118",
      "118",
      "6786",
      "4054"
    ],
    "schoolOrigin": "SMP SULTAN AGUNG KAWUNGANTEN"
  },
  {
    "id": "student-10E4-0119",
    "nis": "0119",
    "name": "GIAN AZKA NARARYA WAHYUDI",
    "studentClass": "10E4",
    "gender": "L",
    "nisn": "0105385605",
    "altNis": [
      "0119",
      "119",
      "6787",
      "5605"
    ],
    "schoolOrigin": "SMP NEGERI 2 SIDAREJA"
  },
  {
    "id": "student-10E4-0120",
    "nis": "0120",
    "name": "HALWA ASSASI GIYO PUTRI",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0119296092",
    "altNis": [
      "0120",
      "120",
      "6788",
      "6092"
    ],
    "schoolOrigin": "SMP NEGERI 4 CIPARI"
  },
  {
    "id": "student-10E4-0121",
    "nis": "0121",
    "name": "HUSNIAH ULFAH",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0111633934",
    "altNis": [
      "0121",
      "121",
      "6789",
      "3934"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E4-0122",
    "nis": "0122",
    "name": "IHAB MUAAFI ALAZIZ",
    "studentClass": "10E4",
    "gender": "L",
    "nisn": "3110209882",
    "altNis": [
      "0122",
      "122",
      "6790",
      "9882"
    ],
    "schoolOrigin": "SMP NEGERI 2 CIPARI"
  },
  {
    "id": "student-10E4-0123",
    "nis": "0123",
    "name": "ISNA AULIYA ASTUTI",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0117529092",
    "altNis": [
      "0123",
      "123",
      "6791",
      "9092"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E4-0124",
    "nis": "0124",
    "name": "KHOLIK DWI ANGGARA",
    "studentClass": "10E4",
    "gender": "L",
    "nisn": "0119851155",
    "altNis": [
      "0124",
      "124",
      "6792",
      "1155"
    ],
    "schoolOrigin": "MTSS ELL FIRDAUS 01"
  },
  {
    "id": "student-10E4-0125",
    "nis": "0125",
    "name": "LUTHFI AFIKASARI",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0116074086",
    "altNis": [
      "0125",
      "125",
      "6793",
      "4086"
    ],
    "schoolOrigin": "SMP NEGERI 2 CIPARI"
  },
  {
    "id": "student-10E4-0126",
    "nis": "0126",
    "name": "MELODI NADA DEWI",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0127145619",
    "altNis": [
      "0126",
      "126",
      "6794",
      "5619"
    ],
    "schoolOrigin": "MTSS SYAMSUL HUDA"
  },
  {
    "id": "student-10E4-0127",
    "nis": "0127",
    "name": "MUHAMMAD SAKHRUL FIRMANSYAH",
    "studentClass": "10E4",
    "gender": "L",
    "nisn": "0119843375",
    "altNis": [
      "0127",
      "127",
      "6795",
      "3375"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E4-0128",
    "nis": "0128",
    "name": "NABILA NUR FAIZAH",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0119451212",
    "altNis": [
      "0128",
      "128",
      "6796",
      "1212"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E4-0129",
    "nis": "0129",
    "name": "NIAR OKTAVIANA PUTRI",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0108881805",
    "altNis": [
      "0129",
      "129",
      "6797",
      "1805"
    ],
    "schoolOrigin": "SMP NEGERI 2 SIDAREJA"
  },
  {
    "id": "student-10E4-0130",
    "nis": "0130",
    "name": "NIMATUL KHASANAH",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0108865062",
    "altNis": [
      "0130",
      "130",
      "6798",
      "5062"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E4-0131",
    "nis": "0131",
    "name": "NUR AGNIA",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0113658867",
    "altNis": [
      "0131",
      "131",
      "6799",
      "8867"
    ],
    "schoolOrigin": "SMP NEGERI 2 CIPARI"
  },
  {
    "id": "student-10E4-0132",
    "nis": "0132",
    "name": "QOTHRUN NADA QALBY",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0111889027",
    "altNis": [
      "0132",
      "132",
      "6800",
      "9027"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E4-0133",
    "nis": "0133",
    "name": "SAEA NUR ALFIAH",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0102884804",
    "altNis": [
      "0133",
      "133",
      "6801",
      "4804"
    ],
    "schoolOrigin": "SMP NEGERI 1 SIDAREJA"
  },
  {
    "id": "student-10E4-0134",
    "nis": "0134",
    "name": "SAFINATUN HUSADA",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "3118354049",
    "altNis": [
      "0134",
      "134",
      "6802",
      "4049"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E4-0135",
    "nis": "0135",
    "name": "SESILLIA SEPTIYANI",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0106826493",
    "altNis": [
      "0135",
      "135",
      "6803",
      "6493"
    ],
    "schoolOrigin": "SMP NEGERI 2 KARANGSAMBUNG"
  },
  {
    "id": "student-10E4-0136",
    "nis": "0136",
    "name": "SHOFI SALSABILA",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0117572621",
    "altNis": [
      "0136",
      "136",
      "6804",
      "2621"
    ],
    "schoolOrigin": "SMP MUHAMMADIYAH 3 KARANGPUCUNG"
  },
  {
    "id": "student-10E4-0137",
    "nis": "0137",
    "name": "SISILIA RAHMA WIGATI",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0117968388",
    "altNis": [
      "0137",
      "137",
      "6805",
      "8388"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E4-0138",
    "nis": "0138",
    "name": "SITI NUR FADILLAH",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0117899252",
    "altNis": [
      "0138",
      "138",
      "6806",
      "9252"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E4-0139",
    "nis": "0139",
    "name": "SITI ZULAEKHA",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0118838708",
    "altNis": [
      "0139",
      "139",
      "6807",
      "8708"
    ],
    "schoolOrigin": "MTSS MAFATIHUL HUDA"
  },
  {
    "id": "student-10E4-0140",
    "nis": "0140",
    "name": "VIRA LISTIARY FAUZIAH",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "0119166718",
    "altNis": [
      "0140",
      "140",
      "6808",
      "6718"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E4-0141",
    "nis": "0141",
    "name": "WILDAN ZAKARIA",
    "studentClass": "10E4",
    "gender": "L",
    "nisn": "3112947929",
    "altNis": [
      "0141",
      "141",
      "6809",
      "7929"
    ],
    "schoolOrigin": "MTsS MA`ARIF NU 01 SIDAREJA"
  },
  {
    "id": "student-10E4-0142",
    "nis": "0142",
    "name": "WILLIAM SEBASTIAN SETIAWAN",
    "studentClass": "10E4",
    "gender": "L",
    "nisn": "0101892685",
    "altNis": [
      "0142",
      "142",
      "6810",
      "2685"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E4-0143",
    "nis": "0143",
    "name": "ZAHROTUSSYARIFAH",
    "studentClass": "10E4",
    "gender": "P",
    "nisn": "3116745383",
    "altNis": [
      "0143",
      "143",
      "6811",
      "5383"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E4-0144",
    "nis": "0144",
    "name": "ZIDAN ARIFUL RIZQI",
    "studentClass": "10E4",
    "gender": "L",
    "nisn": "0107946293",
    "altNis": [
      "0144",
      "144",
      "6812",
      "6293"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E5-0145",
    "nis": "0145",
    "name": "ADITYA KHOERUL MUAZZAM",
    "studentClass": "10E5",
    "gender": "L",
    "nisn": "0116510263",
    "altNis": [
      "0145",
      "145",
      "6813",
      "0263"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E5-0146",
    "nis": "0146",
    "name": "AKHMAD EMIL FAUZI",
    "studentClass": "10E5",
    "gender": "L",
    "nisn": "3115735672",
    "altNis": [
      "0146",
      "146",
      "6814",
      "5672"
    ],
    "schoolOrigin": "MTSS MAFATIHUL HUDA"
  },
  {
    "id": "student-10E5-0147",
    "nis": "0147",
    "name": "ALIFAH NURUL HIDAYAH",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "3118839020",
    "altNis": [
      "0147",
      "147",
      "6815",
      "9020"
    ],
    "schoolOrigin": "MTSS MAFATIHUL HUDA"
  },
  {
    "id": "student-10E5-0148",
    "nis": "0148",
    "name": "ALVIN ZAKY AZIZI",
    "studentClass": "10E5",
    "gender": "L",
    "nisn": "0117736213",
    "altNis": [
      "0148",
      "148",
      "6816",
      "6213"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E5-0149",
    "nis": "0149",
    "name": "ANDIK HAERUL PURNAMA",
    "studentClass": "10E5",
    "gender": "L",
    "nisn": "0117230827",
    "altNis": [
      "0149",
      "149",
      "6817",
      "0827"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E5-0150",
    "nis": "0150",
    "name": "BILQIS AFRILLIANI",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0122541246",
    "altNis": [
      "0150",
      "150",
      "6818",
      "1246"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E5-0151",
    "nis": "0151",
    "name": "CANDY NUR ZASKIA",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0117504570",
    "altNis": [
      "0151",
      "151",
      "6819",
      "4570"
    ],
    "schoolOrigin": "SMP NEGERI 1 BANTARSARI"
  },
  {
    "id": "student-10E5-0152",
    "nis": "0152",
    "name": "DEA PUTRI HERDIANA",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0115778535",
    "altNis": [
      "0152",
      "152",
      "6820",
      "8535"
    ],
    "schoolOrigin": "MTSS GUPPI WANAREJA"
  },
  {
    "id": "student-10E5-0153",
    "nis": "0153",
    "name": "DRAJAT",
    "studentClass": "10E5",
    "gender": "L",
    "nisn": "0084796724",
    "altNis": [
      "0153",
      "153",
      "6821",
      "6724"
    ],
    "schoolOrigin": "SMP NEGERI 2 CIPARI"
  },
  {
    "id": "student-10E5-0154",
    "nis": "0154",
    "name": "FEBIANA DWI LARASATI",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0113035519",
    "altNis": [
      "0154",
      "154",
      "6822",
      "5519"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E5-0155",
    "nis": "0155",
    "name": "FELYSA ANGGUN PUSPITA",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0116247888",
    "altNis": [
      "0155",
      "155",
      "6823",
      "7888"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E5-0156",
    "nis": "0156",
    "name": "FERA MEIRLIANA",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0113316888",
    "altNis": [
      "0156",
      "156",
      "6824",
      "6888"
    ],
    "schoolOrigin": "SMP NEGERI 2 CIPARI"
  },
  {
    "id": "student-10E5-0157",
    "nis": "0157",
    "name": "GALANG TUBAGUS PERMANA",
    "studentClass": "10E5",
    "gender": "L",
    "nisn": "0117923875",
    "altNis": [
      "0157",
      "157",
      "6825",
      "3875"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E5-0158",
    "nis": "0158",
    "name": "GEA NAFA UL NAZA",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0119846842",
    "altNis": [
      "0158",
      "158",
      "6826",
      "6842"
    ],
    "schoolOrigin": "SMP NEGERI 2 CIPARI"
  },
  {
    "id": "student-10E5-0159",
    "nis": "0159",
    "name": "GIBRAN GIAWAN HARITSAH",
    "studentClass": "10E5",
    "gender": "L",
    "nisn": "3111337223",
    "altNis": [
      "0159",
      "159",
      "6827",
      "7223"
    ],
    "schoolOrigin": "SMP NEGERI 2 WANAREJA"
  },
  {
    "id": "student-10E5-0160",
    "nis": "0160",
    "name": "JASMINE ZAZKYA ZAHWA PUTRI NURDIANA",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0127574915",
    "altNis": [
      "0160",
      "160",
      "6828",
      "4915"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E5-0161",
    "nis": "0161",
    "name": "JAUHAROTUN NAFISA",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0103065407",
    "altNis": [
      "0161",
      "161",
      "6829",
      "5407"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E5-0162",
    "nis": "0162",
    "name": "JULIA ANGGRAENI PERTIWI",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0118965887",
    "altNis": [
      "0162",
      "162",
      "6830",
      "5887"
    ],
    "schoolOrigin": "SMP SULTAN AGUNG KAWUNGANTEN"
  },
  {
    "id": "student-10E5-0163",
    "nis": "0163",
    "name": "KHANSA HERWANTI",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0096285806",
    "altNis": [
      "0163",
      "163",
      "6831",
      "5806"
    ],
    "schoolOrigin": "SMP NEGERI 2 SIDAREJA"
  },
  {
    "id": "student-10E5-0164",
    "nis": "0164",
    "name": "MEYTA SOFIANI",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0112894287",
    "altNis": [
      "0164",
      "164",
      "6832",
      "4287"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E5-0165",
    "nis": "0165",
    "name": "NIKEN GITNASYAH PRATAMA",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "3118342224",
    "altNis": [
      "0165",
      "165",
      "6833",
      "2224"
    ],
    "schoolOrigin": "SMP NEGERI 2 SIDAREJA"
  },
  {
    "id": "student-10E5-0166",
    "nis": "0166",
    "name": "NISA ARDIA RAHMA",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0116011413",
    "altNis": [
      "0166",
      "166",
      "6834",
      "1413"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E5-0167",
    "nis": "0167",
    "name": "NOUVAL EZZA SINATRYA",
    "studentClass": "10E5",
    "gender": "L",
    "nisn": "0117063143",
    "altNis": [
      "0167",
      "167",
      "6835",
      "3143"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E5-0168",
    "nis": "0168",
    "name": "NUR AZIZAH",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0114115888",
    "altNis": [
      "0168",
      "168",
      "6836",
      "5888"
    ],
    "schoolOrigin": "SMP NEGERI 3 KEDUNGREJA"
  },
  {
    "id": "student-10E5-0169",
    "nis": "0169",
    "name": "RANIA AQILA KHANSA",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "3110105466",
    "altNis": [
      "0169",
      "169",
      "6837",
      "5466"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E5-0170",
    "nis": "0170",
    "name": "RINDI ARIFAH",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0108371005",
    "altNis": [
      "0170",
      "170",
      "6838",
      "1005"
    ],
    "schoolOrigin": "SMP NEGERI 2 CIPARI"
  },
  {
    "id": "student-10E5-0171",
    "nis": "0171",
    "name": "RIZKIA ANINDYA PUTRI BAHTIAR",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0116207260",
    "altNis": [
      "0171",
      "171",
      "6839",
      "7260"
    ],
    "schoolOrigin": "SMP NEGERI 1 SIDAREJA"
  },
  {
    "id": "student-10E5-0172",
    "nis": "0172",
    "name": "SANTY DESTYANI",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0106752984",
    "altNis": [
      "0172",
      "172",
      "6840",
      "2984"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E5-0173",
    "nis": "0173",
    "name": "SASMITA VERINA NATHANIA",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0114843035",
    "altNis": [
      "0173",
      "173",
      "6841",
      "3035"
    ],
    "schoolOrigin": "SMP NEGERI 2 CIPARI"
  },
  {
    "id": "student-10E5-0174",
    "nis": "0174",
    "name": "SOFIANA SAFITRI",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0118376256",
    "altNis": [
      "0174",
      "174",
      "6842",
      "6256"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E5-0175",
    "nis": "0175",
    "name": "SYIFA NUR FAUZIYAH",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "3112199437",
    "altNis": [
      "0175",
      "175",
      "6843",
      "9437"
    ],
    "schoolOrigin": "MTSS MAFATIHUL HUDA"
  },
  {
    "id": "student-10E5-0176",
    "nis": "0176",
    "name": "SYIFANI RIZQIANI",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0106855229",
    "altNis": [
      "0176",
      "176",
      "6844",
      "5229"
    ],
    "schoolOrigin": "SMP AL ISLAM CIPARI"
  },
  {
    "id": "student-10E5-0177",
    "nis": "0177",
    "name": "TAZAHROTUL LAELY",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0118538862",
    "altNis": [
      "0177",
      "177",
      "6845",
      "8862"
    ],
    "schoolOrigin": "SMP NEGERI 1 SIDAREJA"
  },
  {
    "id": "student-10E5-0178",
    "nis": "0178",
    "name": "ULIL ALBAB",
    "studentClass": "10E5",
    "gender": "L",
    "nisn": "3113374160",
    "altNis": [
      "0178",
      "178",
      "6846",
      "4160"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E5-0179",
    "nis": "0179",
    "name": "VIKA JULIA PUTRI",
    "studentClass": "10E5",
    "gender": "P",
    "nisn": "0108008635",
    "altNis": [
      "0179",
      "179",
      "6847",
      "8635"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E5-0180",
    "nis": "0180",
    "name": "YOSKA PRAWIRA YUDHA",
    "studentClass": "10E5",
    "gender": "L",
    "nisn": "0111702338",
    "altNis": [
      "0180",
      "180",
      "6848",
      "2338"
    ],
    "schoolOrigin": "SMP Negeri 1 Purbalingga"
  },
  {
    "id": "student-10E6-0181",
    "nis": "0181",
    "name": "AFIFAH QAIREEN",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "0108393689",
    "altNis": [
      "0181",
      "181",
      "6849",
      "3689"
    ],
    "schoolOrigin": "SMP NEGERI 1 WANAREJA"
  },
  {
    "id": "student-10E6-0182",
    "nis": "0182",
    "name": "AFIFATUZ ZAHRA",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "3102514874",
    "altNis": [
      "0182",
      "182",
      "6850",
      "4874"
    ],
    "schoolOrigin": "MTSS MAFATIHUL HUDA"
  },
  {
    "id": "student-10E6-0183",
    "nis": "0183",
    "name": "AHMAD GHIFAHRI",
    "studentClass": "10E6",
    "gender": "L",
    "nisn": "0126913965",
    "altNis": [
      "0183",
      "183",
      "6851",
      "3965"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E6-0184",
    "nis": "0184",
    "name": "AIRIN INDRIYANI",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "0119481777",
    "altNis": [
      "0184",
      "184",
      "6852",
      "1777"
    ],
    "schoolOrigin": "SMP NEGERI 22 DEPOK"
  },
  {
    "id": "student-10E6-0185",
    "nis": "0185",
    "name": "ARINI RAHMAWATI",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "0103644066",
    "altNis": [
      "0185",
      "185",
      "6853",
      "4066"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E6-0186",
    "nis": "0186",
    "name": "AURA GHAIDA NABILA WINDI",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "0107929898",
    "altNis": [
      "0186",
      "186",
      "6854",
      "9898"
    ],
    "schoolOrigin": "SMP NEGERI 1 SIDAREJA"
  },
  {
    "id": "student-10E6-0187",
    "nis": "0187",
    "name": "CAROLINE AINUN NISA",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "0116965826",
    "altNis": [
      "0187",
      "187",
      "6855",
      "5826"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E6-0188",
    "nis": "0188",
    "name": "CHERIL RAHMA YAMILLA",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "0117324193",
    "altNis": [
      "0188",
      "188",
      "6856",
      "4193"
    ],
    "schoolOrigin": "SMP MUHAMMADIYAH 1 WANAREJA"
  },
  {
    "id": "student-10E6-0189",
    "nis": "0189",
    "name": "DANIEL ISMAIL SYAPUTRA",
    "studentClass": "10E6",
    "gender": "L",
    "nisn": "0119497487",
    "altNis": [
      "0189",
      "189",
      "6857",
      "7487"
    ],
    "schoolOrigin": "SMP AL ISLAM CIPARI"
  },
  {
    "id": "student-10E6-0190",
    "nis": "0190",
    "name": "DEFINO RIZKY ALFANSYAH",
    "studentClass": "10E6",
    "gender": "L",
    "nisn": "0102830382",
    "altNis": [
      "0190",
      "190",
      "6858",
      "0382"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E6-0191",
    "nis": "0191",
    "name": "DIMAZ ADRIAN PRASETYO",
    "studentClass": "10E6",
    "gender": "L",
    "nisn": "0117166375",
    "altNis": [
      "0191",
      "191",
      "6859",
      "6375"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E6-0192",
    "nis": "0192",
    "name": "FAAZA TSABITA ZAIDA",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "3109833015",
    "altNis": [
      "0192",
      "192",
      "6860",
      "3015"
    ],
    "schoolOrigin": "MTSS MAFATIHUL HUDA"
  },
  {
    "id": "student-10E6-0193",
    "nis": "0193",
    "name": "FEBIANNISA SALSABILA",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "0114848707",
    "altNis": [
      "0193",
      "193",
      "6861",
      "8707"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E6-0194",
    "nis": "0194",
    "name": "FILIA JANITRA JAYANTI",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "0118101013",
    "altNis": [
      "0194",
      "194",
      "6862",
      "1013"
    ],
    "schoolOrigin": "SMP NEGERI 3 SATAP CIPARI"
  },
  {
    "id": "student-10E6-0195",
    "nis": "0195",
    "name": "FITRIYANI NURUL SALSABILA",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "0109684659",
    "altNis": [
      "0195",
      "195",
      "6863",
      "4659"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E6-0196",
    "nis": "0196",
    "name": "HANUN OKTAVIANI",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "0105725106",
    "altNis": [
      "0196",
      "196",
      "6864",
      "5106"
    ],
    "schoolOrigin": "SMP NEGERI 2 CIPARI"
  },
  {
    "id": "student-10E6-0197",
    "nis": "0197",
    "name": "JANDI SIFA LESTARI",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "3106883824",
    "altNis": [
      "0197",
      "197",
      "6865",
      "3824"
    ],
    "schoolOrigin": "SMP NEGERI 1 WANAREJA"
  },
  {
    "id": "student-10E6-0198",
    "nis": "0198",
    "name": "KAFAL ANAM",
    "studentClass": "10E6",
    "gender": "L",
    "nisn": "3113585422",
    "altNis": [
      "0198",
      "198",
      "6866",
      "5422"
    ],
    "schoolOrigin": "SMP NU CIPARI"
  },
  {
    "id": "student-10E6-0199",
    "nis": "0199",
    "name": "KARENZA APRILLIA PRAYATA",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "0117687720",
    "altNis": [
      "0199",
      "199",
      "6867",
      "7720"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E6-0200",
    "nis": "0200",
    "name": "KEANU JABAR PRATAMA SULAEMAN",
    "studentClass": "10E6",
    "gender": "L",
    "nisn": "0119859518",
    "altNis": [
      "0200",
      "200",
      "6868",
      "9518"
    ],
    "schoolOrigin": "SMP NEGERI 2 KARANGPUCUNG"
  },
  {
    "id": "student-10E6-0201",
    "nis": "0201",
    "name": "LINTANG PANCA KUSUMA",
    "studentClass": "10E6",
    "gender": "L",
    "nisn": "0105376437",
    "altNis": [
      "0201",
      "201",
      "6869",
      "6437"
    ],
    "schoolOrigin": "SMP NEGERI 2 CIPARI"
  },
  {
    "id": "student-10E6-0202",
    "nis": "0202",
    "name": "LUTHFIE AGUS RAMADHANY",
    "studentClass": "10E6",
    "gender": "L",
    "nisn": "3111391768",
    "altNis": [
      "0202",
      "202",
      "6870",
      "1768"
    ],
    "schoolOrigin": "MTS MAFATIHUL HUDA"
  },
  {
    "id": "student-10E6-0203",
    "nis": "0203",
    "name": "M AZKAMIRZA RADITYA AHSAN",
    "studentClass": "10E6",
    "gender": "L",
    "nisn": "0119888955",
    "altNis": [
      "0203",
      "203",
      "6871",
      "8955"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E6-0204",
    "nis": "0204",
    "name": "MAHIRA QANITA SUSILO WATI",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "0113673450",
    "altNis": [
      "0204",
      "204",
      "6872",
      "3450"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E6-0205",
    "nis": "0205",
    "name": "MUHAMAD KHOIRURIFA",
    "studentClass": "10E6",
    "gender": "L",
    "nisn": "0112373559",
    "altNis": [
      "0205",
      "205",
      "6873",
      "3559"
    ],
    "schoolOrigin": "MTSS NURUL AMIN AL HIDAYAH SIDAREJA"
  },
  {
    "id": "student-10E6-0206",
    "nis": "0206",
    "name": "NABILA SYIFA",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "0101791168",
    "altNis": [
      "0206",
      "206",
      "6874",
      "1168"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E6-0207",
    "nis": "0207",
    "name": "NAZILA AULIA SYIFA",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "3103825450",
    "altNis": [
      "0207",
      "207",
      "6875",
      "5450"
    ],
    "schoolOrigin": "MTSS SYAMSUL HUDA"
  },
  {
    "id": "student-10E6-0208",
    "nis": "0208",
    "name": "NOFITA ANGGRAENI",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "0119494551",
    "altNis": [
      "0208",
      "208",
      "6876",
      "4551"
    ],
    "schoolOrigin": "SMP PGRI 27 CISURU"
  },
  {
    "id": "student-10E6-0209",
    "nis": "0209",
    "name": "OLIVIA RAHMAH",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "0102973908",
    "altNis": [
      "0209",
      "209",
      "6877",
      "3908"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E6-0210",
    "nis": "0210",
    "name": "RAYYAN KHOIRUS SAHID",
    "studentClass": "10E6",
    "gender": "L",
    "nisn": "3109239770",
    "altNis": [
      "0210",
      "210",
      "6878",
      "9770"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E6-0211",
    "nis": "0211",
    "name": "SELLY SINTIA VEGA",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "0107186278",
    "altNis": [
      "0211",
      "211",
      "6879",
      "6278"
    ],
    "schoolOrigin": "SMP NEGERI 2 CIPARI"
  },
  {
    "id": "student-10E6-0212",
    "nis": "0212",
    "name": "SINTIA ASIH",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "0113815850",
    "altNis": [
      "0212",
      "212",
      "6880",
      "5850"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E6-0213",
    "nis": "0213",
    "name": "SYAHRA SALSABILA RAMADANI",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "0118264273",
    "altNis": [
      "0213",
      "213",
      "6881",
      "4273"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E6-0214",
    "nis": "0214",
    "name": "VERA LISTIARY FAUZIAH",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "0112517589",
    "altNis": [
      "0214",
      "214",
      "6882",
      "7589"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E6-0215",
    "nis": "0215",
    "name": "WINDI SASKILA",
    "studentClass": "10E6",
    "gender": "P",
    "nisn": "0102912192",
    "altNis": [
      "0215",
      "215",
      "6883",
      "2192"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E6-0216",
    "nis": "0216",
    "name": "YUSUF REKHANUDIN",
    "studentClass": "10E6",
    "gender": "L",
    "nisn": "0112157684",
    "altNis": [
      "0216",
      "216",
      "6884",
      "7684"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E7-0217",
    "nis": "0217",
    "name": "ADELINA RENATHA",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0116792940",
    "altNis": [
      "0217",
      "217",
      "6885",
      "2940"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E7-0218",
    "nis": "0218",
    "name": "ALI RAMDAN AL ZAEN",
    "studentClass": "10E7",
    "gender": "L",
    "nisn": "3101363761",
    "altNis": [
      "0218",
      "218",
      "6886",
      "3761"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E7-0219",
    "nis": "0219",
    "name": "ALYA FEBRIANA",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0112626448",
    "altNis": [
      "0219",
      "219",
      "6887",
      "6448"
    ],
    "schoolOrigin": "SMP PGRI 7 WANAREJA"
  },
  {
    "id": "student-10E7-0220",
    "nis": "0220",
    "name": "ANJARIYANI",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "3119010004",
    "altNis": [
      "0220",
      "220",
      "6888",
      "0004"
    ],
    "schoolOrigin": "MTSS MAFATIHUL HUDA"
  },
  {
    "id": "student-10E7-0221",
    "nis": "0221",
    "name": "ANNA FIARENZA",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0118828754",
    "altNis": [
      "0221",
      "221",
      "6889",
      "8754"
    ],
    "schoolOrigin": "SMP NEGERI 1 WANAREJA"
  },
  {
    "id": "student-10E7-0222",
    "nis": "0222",
    "name": "DENISA AULIA",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0119888485",
    "altNis": [
      "0222",
      "222",
      "6890",
      "8485"
    ],
    "schoolOrigin": "SMP NEGERI 1 SIDAREJA"
  },
  {
    "id": "student-10E7-0223",
    "nis": "0223",
    "name": "DESTA AULIA",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0117893641",
    "altNis": [
      "0223",
      "223",
      "6891",
      "3641"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E7-0224",
    "nis": "0224",
    "name": "DWI PRASETIYO",
    "studentClass": "10E7",
    "gender": "L",
    "nisn": "3110141667",
    "altNis": [
      "0224",
      "224",
      "6892",
      "1667"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E7-0225",
    "nis": "0225",
    "name": "FADIYAH AIDA ZAFIRAH",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0119447365",
    "altNis": [
      "0225",
      "225",
      "6893",
      "7365"
    ],
    "schoolOrigin": "MTSS DARUL ULUM 2"
  },
  {
    "id": "student-10E7-0226",
    "nis": "0226",
    "name": "FADLAN SURURI",
    "studentClass": "10E7",
    "gender": "L",
    "nisn": "3106181849",
    "altNis": [
      "0226",
      "226",
      "6894",
      "1849"
    ],
    "schoolOrigin": "MTSS MAFATIHUL HUDA"
  },
  {
    "id": "student-10E7-0227",
    "nis": "0227",
    "name": "FARIDA WULANDARI",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0111637372",
    "altNis": [
      "0227",
      "227",
      "6895",
      "7372"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E7-0228",
    "nis": "0228",
    "name": "FATIHUL IKHSAN",
    "studentClass": "10E7",
    "gender": "L",
    "nisn": "3115576043",
    "altNis": [
      "0228",
      "228",
      "6896",
      "6043"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E7-0229",
    "nis": "0229",
    "name": "HANI OKTAFIANI",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0119628573",
    "altNis": [
      "0229",
      "229",
      "6897",
      "8573"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E7-0230",
    "nis": "0230",
    "name": "HIMAWAN FARAND ZAHABI",
    "studentClass": "10E7",
    "gender": "L",
    "nisn": "3119091873",
    "altNis": [
      "0230",
      "230",
      "6898",
      "1873"
    ],
    "schoolOrigin": "MTSS MAFATIHUL HUDA"
  },
  {
    "id": "student-10E7-0231",
    "nis": "0231",
    "name": "INTAN NUR AVRILIANI",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0117319233",
    "altNis": [
      "0231",
      "231",
      "6899",
      "9233"
    ],
    "schoolOrigin": "SMP NEGERI 2 CIPARI"
  },
  {
    "id": "student-10E7-0232",
    "nis": "0232",
    "name": "KHUMAIROH DYAH UTARI",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0105387835",
    "altNis": [
      "0232",
      "232",
      "6900",
      "7835"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E7-0233",
    "nis": "0233",
    "name": "MARWA ISTIQOMAH",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0114130425",
    "altNis": [
      "0233",
      "233",
      "6901",
      "0425"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E7-0234",
    "nis": "0234",
    "name": "MELLYN INDAH PRATIWI",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0112834345",
    "altNis": [
      "0234",
      "234",
      "6902",
      "4345"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E7-0235",
    "nis": "0235",
    "name": "MELVYN HAFIDZ SETIAWAN",
    "studentClass": "10E7",
    "gender": "L",
    "nisn": "0116373001",
    "altNis": [
      "0235",
      "235",
      "6903",
      "3001"
    ],
    "schoolOrigin": "SMP NEGERI 2 KARANGPUCUNG"
  },
  {
    "id": "student-10E7-0236",
    "nis": "0236",
    "name": "MIKAYLA VIORENTINA",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0118439253",
    "altNis": [
      "0236",
      "236",
      "6904",
      "9253"
    ],
    "schoolOrigin": "SMP NEGERI 3 KEDUNGREJA"
  },
  {
    "id": "student-10E7-0237",
    "nis": "0237",
    "name": "MUHAMMAD ILHAM PRAYUDI",
    "studentClass": "10E7",
    "gender": "L",
    "nisn": "0118974365",
    "altNis": [
      "0237",
      "237",
      "6905",
      "4365"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E7-0238",
    "nis": "0238",
    "name": "NADIRATUN KHOTIMAH",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0114187956",
    "altNis": [
      "0238",
      "238",
      "6906",
      "7956"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E7-0239",
    "nis": "0239",
    "name": "NAILA AZMI AULIA",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "3111918106",
    "altNis": [
      "0239",
      "239",
      "6907",
      "8106"
    ],
    "schoolOrigin": "MTSS MAFATIHUL HUDA"
  },
  {
    "id": "student-10E7-0240",
    "nis": "0240",
    "name": "NAYLA NURVITA DEWI",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0113080986",
    "altNis": [
      "0240",
      "240",
      "6908",
      "0986"
    ],
    "schoolOrigin": "SMP NEGERI 2 KEDUNGREJA"
  },
  {
    "id": "student-10E7-0241",
    "nis": "0241",
    "name": "NITA NAYLA RADISTI",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0119015180",
    "altNis": [
      "0241",
      "241",
      "6909",
      "5180"
    ],
    "schoolOrigin": "SMP AL ISLAM CIPARI"
  },
  {
    "id": "student-10E7-0242",
    "nis": "0242",
    "name": "NIZAM MAOLANA",
    "studentClass": "10E7",
    "gender": "L",
    "nisn": "0113769526",
    "altNis": [
      "0242",
      "242",
      "6910",
      "9526"
    ],
    "schoolOrigin": "MTSS NURUL AMIN AL HIDAYAH SIDAREJA"
  },
  {
    "id": "student-10E7-0243",
    "nis": "0243",
    "name": "NOVITA MARZA SAFIKAH",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0102251003",
    "altNis": [
      "0243",
      "243",
      "6911",
      "1003"
    ],
    "schoolOrigin": "SMP NEGERI 2 KAWUNGANTEN"
  },
  {
    "id": "student-10E7-0244",
    "nis": "0244",
    "name": "REFI ANGGRAENI",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0117888073",
    "altNis": [
      "0244",
      "244",
      "6912",
      "8073"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E7-0245",
    "nis": "0245",
    "name": "RESHA PRATAMA",
    "studentClass": "10E7",
    "gender": "L",
    "nisn": "0076996159",
    "altNis": [
      "0245",
      "245",
      "6913",
      "6159"
    ],
    "schoolOrigin": "SMP NEGERI 2 CIPARI"
  },
  {
    "id": "student-10E7-0246",
    "nis": "0246",
    "name": "RIZKY SEPTIYANA WIJAYA",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0108523181",
    "altNis": [
      "0246",
      "246",
      "6914",
      "3181"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E7-0247",
    "nis": "0247",
    "name": "SABDA ALI ZAKARIA",
    "studentClass": "10E7",
    "gender": "L",
    "nisn": "0118687585",
    "altNis": [
      "0247",
      "247",
      "6915",
      "7585"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E7-0248",
    "nis": "0248",
    "name": "SHAPIRA IFRA CALINDA PUJIARTO",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0119728899",
    "altNis": [
      "0248",
      "248",
      "6916",
      "8899"
    ],
    "schoolOrigin": "SMP NEGERI 1 SIDAREJA"
  },
  {
    "id": "student-10E7-0249",
    "nis": "0249",
    "name": "TANIA KHOIRUNISA",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0117865669",
    "altNis": [
      "0249",
      "249",
      "6917",
      "5669"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E7-0250",
    "nis": "0250",
    "name": "THAMIKA ZULFANISA",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0117454084",
    "altNis": [
      "0250",
      "250",
      "6918",
      "4084"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  },
  {
    "id": "student-10E7-0251",
    "nis": "0251",
    "name": "VERA NUR AULIA",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0105196201",
    "altNis": [
      "0251",
      "251",
      "6919",
      "6201"
    ],
    "schoolOrigin": "MTSS MA`ARIF WANAREJA"
  },
  {
    "id": "student-10E7-0252",
    "nis": "0252",
    "name": "YATIMATU AULIATUS SEFA",
    "studentClass": "10E7",
    "gender": "P",
    "nisn": "0118340612",
    "altNis": [
      "0252",
      "252",
      "6920",
      "0612"
    ],
    "schoolOrigin": "SMP NEGERI 1 CIPARI"
  }
];

// Rapid lookup map by NIS (exact, padded, seq, or alias)
const studentLookupMap = new Map<string, RegisteredStudent>();

INITIAL_REGISTERED_STUDENTS.forEach((student) => {
  // Index primary NIS
  studentLookupMap.set(student.nis.toLowerCase(), student);
  studentLookupMap.set(student.nis.padStart(4, '0'), student);
  studentLookupMap.set(String(parseInt(student.nis, 10)), student);

  // Index aliases
  student.altNis.forEach((alt) => {
    if (alt) {
      studentLookupMap.set(alt.toLowerCase(), student);
      studentLookupMap.set(alt.padStart(4, '0'), student);
      studentLookupMap.set(String(parseInt(alt, 10)), student);
    }
  });

  if (student.nisn) {
    studentLookupMap.set(student.nisn.toLowerCase(), student);
    if (student.nisn.length >= 4) {
      studentLookupMap.set(student.nisn.slice(-4), student);
    }
  }
});

export function findStudentByNis(query: string): RegisteredStudent | null {
  if (!query) return null;
  const clean = query.trim().replace(/^0+/, ''); // e.g. "0001" -> "1"
  const raw = query.trim();

  // 1. Direct map lookup
  if (studentLookupMap.has(raw)) return studentLookupMap.get(raw)!;
  if (studentLookupMap.has(raw.padStart(4, '0'))) return studentLookupMap.get(raw.padStart(4, '0'))!;
  if (clean && studentLookupMap.has(clean)) return studentLookupMap.get(clean)!;

  // 2. Linear search in student collection for any alias or partial 4-digit match
  const found = INITIAL_REGISTERED_STUDENTS.find((s) => {
    if (s.nis === raw || s.nis.padStart(4, '0') === raw.padStart(4, '0')) return true;
    if (clean && String(parseInt(s.nis, 10)) === clean) return true;
    if (s.altNis && s.altNis.some((a) => a === raw || a === clean || a.padStart(4, '0') === raw.padStart(4, '0'))) return true;
    if (s.nisn && (s.nisn === raw || s.nisn.slice(-4) === raw)) return true;
    return false;
  });

  return found || null;
}

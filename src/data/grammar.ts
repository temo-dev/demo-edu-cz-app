export interface GrammarRule {
  id: string
  title: string
  titleVi: string
  explanationVi: string
  example: { cs: string; vi: string }
  level: 'A1' | 'A2' | 'B1'
}

export const grammarRules: GrammarRule[] = [
  {
    id: 'g01', level: 'A1',
    title: 'Giới tính danh từ',
    titleVi: 'Danh từ tiếng Séc có 3 giới tính',
    explanationVi: 'Mỗi danh từ tiếng Séc có giới tính: nam (masculine), nữ (feminine), trung (neuter). Giới tính ảnh hưởng đến tính từ và đại từ đi kèm.\n\n• Nam: muž (đàn ông), hrad (lâu đài)\n• Nữ: žena (phụ nữ), kniha (sách)\n• Trung: město (thành phố), auto (xe hơi)',
    example: { cs: 'Ten muž / Ta žena / To město', vi: 'Người đàn ông đó / Người phụ nữ đó / Thành phố đó' },
  },
  {
    id: 'g02', level: 'A1',
    title: 'Động từ "být" (to be)',
    titleVi: 'Chia động từ "být" — là/ở',
    explanationVi: 'Být là động từ bất quy tắc, dùng để nói "là" hoặc "ở":\n\njá jsem — tôi là\nty jsi — bạn là\non/ona/ono je — anh/chị/nó là\nmy jsme — chúng tôi là\nvy jste — các bạn là\noni jsou — họ là',
    example: { cs: 'Já jsem student. Ona je učitelka.', vi: 'Tôi là sinh viên. Cô ấy là giáo viên.' },
  },
  {
    id: 'g03', level: 'A1',
    title: 'Phủ định với "ne-"',
    titleVi: 'Cách phủ định trong tiếng Séc',
    explanationVi: 'Thêm "ne" vào trước động từ để phủ định:\n\njsem → nejsem (tôi không là)\nmám → nemám (tôi không có)\njdu → nejdu (tôi không đi)\n\nKhác với tiếng Việt, "ne" gắn liền với động từ không có khoảng cách.',
    example: { cs: 'Nejsem unavený. Nemám čas.', vi: 'Tôi không mệt. Tôi không có thời gian.' },
  },
  {
    id: 'g04', level: 'A1',
    title: 'Câu hỏi với "Co?" và "Kdo?"',
    titleVi: 'Hỏi "Cái gì?" và "Ai?"',
    explanationVi: 'Co? = Cái gì?\nKdo? = Ai?\nKde? = Ở đâu?\nKdy? = Khi nào?\nJak? = Như thế nào?\nProč? = Tại sao?',
    example: { cs: 'Co je to? Kdo jsi ty?', vi: 'Đó là cái gì? Bạn là ai?' },
  },
  {
    id: 'g05', level: 'A2',
    title: 'Số nhiều danh từ',
    titleVi: 'Danh từ số nhiều',
    explanationVi: 'Tiếng Séc có quy tắc số nhiều phức tạp theo giới tính:\n\nNam cứng: student → studenti\nNam mềm: muž → muži\nNữ cứng: žena → ženy\nNữ mềm: ulice → ulice (giữ nguyên)\nTrung: město → města\n\nNgoài ra còn nhiều trường hợp ngoại lệ!',
    example: { cs: 'jeden student → dva studenti', vi: 'một sinh viên → hai sinh viên' },
  },
  {
    id: 'g06', level: 'A2',
    title: 'Cách 4 — Accusative',
    titleVi: 'Cách 4: tân ngữ trực tiếp',
    explanationVi: 'Khi danh từ là tân ngữ trực tiếp (bị tác động), nó đổi dạng:\n\nNam sinh vật: vidím Petra (thấy Peter)\nNam vô sinh: vidím hrad (thấy lâu đài — không đổi)\nNữ: vidím ženu (thấy phụ nữ, a→u)\nTrung: vidím město (không đổi)',
    example: { cs: 'Vidím ženu. Mám kávu.', vi: 'Tôi thấy người phụ nữ. Tôi có cà phê.' },
  },
  {
    id: 'g07', level: 'A2',
    title: 'Thì quá khứ',
    titleVi: 'Nói về quá khứ',
    explanationVi: 'Thì quá khứ dùng dạng l-participle + trợ động từ být:\n\nJá jsem dělal/dělala (tôi đã làm — nam/nữ)\nTy jsi dělal/dělala\nOn dělal / Ona dělala (không cần trợ động từ)\nMy jsme dělali\n\n⚠️ Phân biệt giới tính khi nói về bản thân!',
    example: { cs: 'Včera jsem pracoval. Šla jsem domů.', vi: 'Hôm qua tôi (nam) đã làm việc. Tôi (nữ) đã về nhà.' },
  },
  {
    id: 'g08', level: 'B1',
    title: 'Cách 2 — Genitive',
    titleVi: 'Cách 2: sở hữu và phủ định',
    explanationVi: 'Genitive (cách 2) dùng để:\n1. Sở hữu: kniha Petra = sách của Peter\n2. Phủ định: nemám čas = tôi không có thời gian\n3. Sau một số giới từ: bez (không có), do (vào), z (từ), od (từ)',
    example: { cs: 'Nemám peněz. Jdu bez kabátu.', vi: 'Tôi không có tiền. Tôi đi không có áo khoác.' },
  },
]

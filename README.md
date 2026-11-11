# MilkLoop · Pitch gọi vốn 5 phút

Deck HTML cho bài thực hành 3.2 Nguồn vốn & Pitching (On-Stage Pitch) của Nhóm 5, môn Khởi nghiệp HK261, GVHD TS. Đào Hồng Hải. Dự án: whey protein và phô mai tươi từ cùng một mẻ sữa.

**Bản trực tuyến:** https://khoaphunsonac.github.io/Khoi_nghiep_HK261/

## Trong thư mục có gì

| Đường dẫn | Nội dung |
|---|---|
| `slides/index.html` | 12 slide chính + 1 slide mở phần hỏi đáp + 9 slide dự phòng D1–D9 (Reveal.js 5.1.0) |
| `slides/style.css` | Màu, bố cục, trạng thái cuối của mọi phần tử (dùng khi in PDF) |
| `slides/app.js` | Khởi tạo Reveal, hiệu ứng GSAP, biểu đồ tài chính, số đếm, popup |
| `slides/evidence.js` | Nội dung minh chứng cho từng nút ⓘ và định nghĩa thuật ngữ |
| `slides/lib/` | Reveal.js và GSAP 3.13 (SplitText, DrawSVG, ScrambleText), đã tải về để chạy offline |
| `slides/assets/img/` | Logo trường, ảnh Unsplash (`photo/`), minh họa unDraw (`ud/`), Open Doodles (`od/`), ảnh chụp bảng Excel (`excel/`) |
| `Slides_Pitch_MilkLoop.pdf` | Bản PDF để nộp, 22 trang |
| `Kich_ban_thuyet_trinh.md` | Kịch bản 5 người, khoảng 5 phút, kèm bảng hỏi đáp |
| `Hoi_dap_thuong_gap.md` | Câu hỏi dự kiến, gợi ý trả lời, slide dự phòng tương ứng |
| `Noi_dung_seminar.txt` | Chữ trên từng slide, nguồn số liệu, ghi công hình ảnh |
| `Thuat_ngu.md` | Thuật ngữ LTV, COCA, NPV, IRR, PP, CFT… |
| `export_pdf.sh` | Lệnh xuất lại PDF |
| `.github/workflows/pages.yml` | Tự deploy thư mục `slides/` lên GitHub Pages mỗi lần push nhánh `main` |

Số liệu trên slide lấy từ `Báo cáo/Excel/Tai_chinh_Pho_mai_Whey.xlsx` (thư mục báo cáo của nhóm, không nằm trong repo này).

## Mở và trình chiếu

Nhấp đúp `slides/index.html` hoặc mở bản trực tuyến. Nên dùng Chrome hoặc Edge.

| Phím | Tác dụng |
|---|---|
| → hoặc Space | Ý tiếp theo / slide sau |
| ← | Lùi lại |
| F | Toàn màn hình |
| O hoặc Esc | Xem tổng quan các slide |
| S | Mở cửa sổ ghi chú người nói |

**Hai màn hình:** nhấn `S`, kéo cửa sổ ghi chú sang màn hình laptop, để cửa sổ slide trên máy chiếu rồi nhấn `F`.

Slide dự phòng (D1–D9, D9 là tóm tắt kế hoạch kinh doanh) nằm sau slide 12; khi hội đồng hỏi, nhấn `O` để nhảy tới slide cần mở.

## Minh chứng số liệu và thuật ngữ

- **Nút ⓘ màu vàng** cạnh các con số: bấm để mở popup gồm công thức, ảnh chụp bảng Excel và nguồn (sheet Excel, mục trong báo cáo). Khi popup mở, phím mũi tên không chuyển slide; nhấn Esc hoặc bấm ra ngoài để đóng.
- **Thuật ngữ gạch chân chấm** (COA, WPC 80, TAM, SAM, SOM, LTV, COCA, NPV, IRR, PP, CFT, CPM, BMC, MVP…): rê chuột hoặc Tab tới để xem định nghĩa ngắn, bấm để xem giải thích đầy đủ.
- Sửa nội dung trong `slides/evidence.js`: `MILK_EV` cho nút ⓘ (khóa = `data-ev`), `MILK_TERMS` cho thuật ngữ (khóa = `data-term`).
- Bản PDF ẩn các nút ⓘ.

## Hiệu ứng

Mỗi slide tự chạy hiệu ứng khi chuyển tới: màn quét hai lớp màu khi đổi slide, chữ tiêu đề hiện theo từng từ hoặc từng ký tự, slogan xáo chữ rồi hiện đúng, hũ whey rơi và nảy, hình minh họa trượt vào và nhích theo chuột, số đếm lên, đường vẽ dần, biểu đồ cột mọc lên, ảnh đội ngũ xòe như bộ bài. Chỉ slide 10 có ý hiện dần (3 lần bấm).

Máy bật chế độ giảm chuyển động (prefers-reduced-motion) thì slide hiện thẳng trạng thái cuối.

## Xuất lại PDF

**Bằng lệnh** (WSL hoặc Git Bash trên Windows): `./export_pdf.sh`

**Bằng tay:** mở `slides/index.html?print-pdf` trong Chrome, Ctrl+P, *Save as PDF*, lề *None*, tích *Background graphics*.

Khi in, hiệu ứng tắt, mọi ý hiện ở trạng thái cuối, mỗi slide đúng một trang.

## Deploy GitHub Pages

Đã cấu hình sẵn: mỗi lần `git push` lên nhánh `main`, GitHub Actions đưa thư mục `slides/` lên Pages. Xem tiến trình ở tab *Actions* của repo. Muốn chạy lại thủ công: tab *Actions* → *Deploy slides to GitHub Pages* → *Run workflow*.

## Quy ước khi sửa

- **Số trang** lấy từ `data-n` của mỗi `<section>`; slide 13 trở đi hiện là `Q&A`, `D1`…
- **Màu nền theo slide:** `data-theme` = `orange`, `mint`, `blue`, `rose`, `yellow`.
- **Hiệu ứng vào slide:** gắn `data-anim` = `fade-up`, `pop`, `drop`, `slide-r`, `slide-l`, `flip`, `stagger`; tiêu đề dùng class `split-words` hoặc `split-chars`; số đếm dùng `class="count" data-to="..." data-d="số chữ số thập phân"`.
- **Ý hiện dần:** `class="fragment fade-up"`; nhớ sửa số `(bấm)` trong kịch bản.
- **Biểu đồ tài chính:** số nằm ở biến `FIN` trong `app.js` (lấy từ sheet CF của file Excel).
- **Mục chờ duyệt:** gắn class `pending` để tô chữ đỏ; hiện không còn mục nào.

## Ảnh và minh họa

Tất cả đã tải về `slides/assets/img/`, không cần mạng khi trình chiếu.

- **Ảnh Unsplash** (Unsplash License): Eiliv Aceron (sữa), Eric Prouzet (phô mai), Alex Saks (whey), Jakub Klucký (phòng gym).
- **unDraw** (undraw.co, giấy phép unDraw): màu nhấn đổi từ `#6c63ff` sang cam `#FF5A1F`.
- **Open Doodles** (opendoodles.com, Pablo Stanley, CC0): màu hồng đổi sang cam `#FF5A1F` và xanh `#12B886`.
- Ảnh thành viên do nhóm cung cấp.

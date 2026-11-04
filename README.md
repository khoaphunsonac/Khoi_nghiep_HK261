# Seminar 3.1 Phân tích tài chính: Phô mai tươi & Whey Protein

Bộ slide HTML trình bày chủ đề 3.1 của môn Khởi nghiệp (GVHD TS. Đào Hồng Hải, HK261). Bố cục đi theo năm phần trong báo cáo *Mô hình kinh doanh* của nhóm. Phần 5 được dựng lại theo đúng quy trình 5 bước trong bài giảng.

## Trong thư mục có gì

| Đường dẫn | Nội dung |
|---|---|
| `slides/index.html` | 34 slide (Reveal.js 5.1.0) |
| `slides/style.css` | Màu Bách Khoa, bố cục, các component |
| `slides/app.js` | Footer, mục lục phần, hiệu ứng morph, component, biểu đồ |
| `slides/lib/reveal/` | Reveal.js và plugin ghi chú, đã tải về để chạy offline |
| `slides/assets/` | Logo trường, font, ảnh Unsplash (`img/photo/`), minh họa unDraw (`img/undraw/`) |
| `Slides_3.1_Phan_tich_tai_chinh.pdf` | Bản PDF để nộp, 34 trang |
| `Kich_ban_thuyet_trinh.md` | Kịch bản cho 5 người nói, khoảng 19 phút, kèm phần hỏi đáp |
| `Thuat_ngu.md` | Định nghĩa các thuật ngữ: LTV, COCA, NPV, IRR, PP, CFT, chiết khấu, các mô hình doanh thu và cách định giá… |
| `Noi_dung_seminar.txt` | Chữ trên từng slide, ghi chú người nói, các chỗ đã sửa, tài liệu tham khảo |
| `export_pdf.sh` | Lệnh xuất lại PDF |

## Mở và trình chiếu

Nhấp đúp `slides/index.html`. Không cần mạng, không cần server.

| Phím | Tác dụng |
|---|---|
| → hoặc Space | Ý tiếp theo, hết ý thì sang slide sau |
| ← | Lùi lại |
| F | Toàn màn hình |
| O hoặc Esc | Xem tổng quan các slide |
| S | Mở cửa sổ ghi chú người nói |

**Hai màn hình:** nhấn `S` để mở cửa sổ ghi chú. Kéo cửa sổ ghi chú sang màn hình laptop, để cửa sổ slide trên máy chiếu rồi nhấn `F`. Nếu trình duyệt chặn popup, cho phép popup với file này.

Một số slide có phần tương tác bằng chuột:

- Slide 05: rê chuột lên từng mô hình doanh thu để mở ra.
- Slide 10: nút Đến sớm / Đến sau làm nổi một nhóm khách.
- Slide 12: bấm vào một thẻ giá để kéo nó lên.
- Slide 15: nút *Ví dụ trong bài giảng* mở bảng LTV mẫu của thầy.
- Slide 17: các tab Phô mai / Whey / Cả hai.
- Slide 30: công tắc *Gồm CFT* và nút *Đối chiếu ví dụ*.
- Slide 31: kéo thanh trượt (hoặc bấm vào rồi dùng ← →) để đổi suất chiết khấu r.

## Mang sang máy khác

Chép nguyên thư mục `Seminar_3.1_Tai_chinh`, không chép riêng `index.html`. Nên mở bằng Chrome hoặc Edge bản mới, vì hiệu ứng chuyển trang kiểu Morph cần View Transitions API. Firefox vẫn chạy được, chỉ chuyển trang bằng cách đổi thẳng.

## Xuất lại PDF

**Bằng tay:** mở `slides/index.html?print-pdf` trong Chrome, nhấn Ctrl+P, chọn *Save as PDF*, khổ *Default*, lề *None*, tích *Background graphics*.

**Bằng lệnh** (WSL hoặc Git Bash trên Windows):

```bash
./export_pdf.sh
```

Lệnh này gọi Chrome headless:

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --no-pdf-header-footer \
  --allow-file-access-from-files --virtual-time-budget=15000 --run-all-compositor-stages-before-draw \
  --print-to-pdf="C:/.../Slides_3.1_Phan_tich_tai_chinh.pdf" "file:///C:/.../slides/index.html?print-pdf"
```

Khi in, mọi ý hiện ở trạng thái cuối, animation tắt, các nút tương tác và hộp popup bị ẩn. Mỗi slide ra đúng một trang.

## Quy ước khi sửa

- **Số slide** (`data-n`) và footer do `app.js` tự đánh. Thêm hay bớt slide thì không phải sửa số bằng tay.
- **Footer:** lấy tên phần từ `data-part` của mỗi `<section>`. Footer không ghi nguồn; `data-src` chỉ dùng để ghi nguồn từng slide trong `Noi_dung_seminar.txt`.
- **Slide chia phần** có `data-divider="N"`. Mục lục bên phải tự lấy tiêu đề các slide đến phần sau.
- **Ý hiện dần:** thêm `class="fragment up"`. Mỗi fragment là một lần bấm, nên nhớ sửa số `(bấm)` trong kịch bản.
- **Ghi chú người nói:** `<aside class="notes">...</aside>` ở cuối section.
- **Morph:** tiêu đề, logo, footer và các khối có class `blk` (theo thứ tự) tự ghép đôi giữa hai slide liền nhau. Muốn hai phần tử cụ thể ghép với nhau thì cho cùng `data-id`, ví dụ `data-id="steps"` ở thanh 5 bước, `data-id="chain"` ở mục lục và slide tổng kết.
- **Số liệu biểu đồ** nằm ở đầu `app.js` (biến `D`). Sửa số trong bảng HTML thì sửa cả ở đây.
- **Bìa:** tên nhóm và danh sách thành viên (họ tên, MSSV) nằm ở slide 01 trong `index.html`; slide 34 (cảm ơn) cũng có danh sách này.

## Component dùng lại từ Spider UI

Spider UI là thư viện React. Các component dưới đây được viết lại bằng HTML, CSS, JS thuần để chạy cùng Reveal.js mà không cần build: Signature, Badge, Avatar, Rich Button, Switch, Toggle, Discrete Tabs, Stepper, Elastic Slider, Modal, Drawer, Progressive Blur, Accordion Reveal, Card Stroke, Fan Cards, Pricing, Underline Hover, Text Roll, Wave Text, Dia Text Reveal, Scramble Text.

## Ảnh và minh họa

Tất cả đã tải về máy, không cần mạng khi trình chiếu.

- **Ảnh Unsplash** (Unsplash License, miễn phí, không bắt buộc ghi công): Eiliv Aceron (sữa), Eric Prouzet (quầy phô mai), Alex Saks (whey), Jakub Klucký (phòng gym), Walls.io (họp nhóm), Jakub Żerdzicki (máy tính).
- **Minh họa unDraw** (giấy phép unDraw, miễn phí): màu nhấn đã đổi từ tím mặc định sang xanh `#1488DB` của trường. Muốn đổi minh họa khác thì tải SVG ở undraw.co, thay `#6c63ff` bằng `#1488DB` rồi bỏ vào `slides/assets/img/undraw/`.

## Deploy

Hiện chưa deploy. Muốn đưa lên Vercel thì chạy trong thư mục `slides/`:

```bash
npx vercel deploy --prod --yes
```

## Slide cảm ơn (Signature)

Slide 34 dùng component Signature: chữ viết tay hiện dần theo nét. Bản gốc của Spider UI nạp font bằng opentype.js lúc chạy; ở đây các nét chữ đã được tính sẵn bằng font Dancing Script (giấy phép OFL, đủ dấu tiếng Việt) và nhúng thẳng vào `index.html` để chạy offline. Muốn đổi câu chữ thì cần tạo lại nét chữ: chạy opentype.js với font Dancing Script và câu mới, rồi thay các thẻ `<svg class="sig">` trong slide 34.

Danh mục tài liệu tham khảo không còn trên slide, vẫn có trong `Noi_dung_seminar.txt`.

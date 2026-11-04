# Thuật ngữ: Phân tích tài chính dự án Phô mai tươi & Whey Protein

Giải thích các từ viết tắt và khái niệm dùng trong slide. Mỗi mục có định nghĩa, công thức (nếu có), số của dự án và slide liên quan. Định nghĩa bám theo bài giảng 3.1 của TS. Đào Hồng Hải; số liệu lấy từ báo cáo *Mô hình kinh doanh* của nhóm.

**Mục lục:** [Chỉ số chính](#1-chỉ-số-chính) · [Thành phần trong công thức](#2-thành-phần-trong-công-thức) · [Dòng tiền](#3-dòng-tiền) · [Chi phí](#4-chi-phí) · [Doanh thu và định giá](#5-doanh-thu-và-định-giá) · [Khách hàng và thị trường](#6-khách-hàng-và-thị-trường) · [Sản phẩm](#7-sản-phẩm) · [Bảng tra nhanh](#8-bảng-tra-nhanh)

---

## 1. Chỉ số chính

### LTV: Giá trị trọn đời của một khách hàng
*Lifetime Value, còn gọi là CLV hay CLTV.*

Tổng lợi nhuận gộp một khách hàng mang lại trong suốt thời gian họ còn mua hàng, quy về giá trị hôm nay. Với công ty khởi nghiệp, bài giảng chỉ tính **5 năm đầu**.

```
LTV = Σ (t = 0 → 5)  Lợi nhuận gộp(t) / (1 + i)^t
```

- **Dự án:** LTV = **24.996.592 ₫** (làm tròn 25 triệu) cho một khách mua cả phô mai và whey. Whey đóng góp khoảng 83%.
- **Ý nghĩa:** cho biết doanh nghiệp được phép chi tối đa bao nhiêu để có một khách mà vẫn có lời.
- Slide 15–17.

### COCA: Chi phí để có được một khách hàng
*Cost of Customer Acquisition, còn gọi là CAC.*

Chi phí nghiên cứu, tiếp thị, quảng cáo và bán hàng bỏ ra để thuyết phục được **một khách hàng mới**.

```
COCA(t) = [TMSE(t) − IBSE(t)] / NC(t)
```

- **COCA càng nhỏ càng tốt.** Chỉ số này thay đổi theo thời gian và không phải thước đo duy nhất của hiệu quả tiếp thị.
- **Dự án:** 3,6 triệu (năm 1) → 1,91 triệu (năm 2–3) → 1,4 triệu (năm 4–5).
- Slide 19–20.

### Tỷ số LTV : COCA
Một khách mang về gấp bao nhiêu lần chi phí để có được khách đó. Nhà đầu tư mạo hiểm David Skok khuyến cáo một mô hình kinh doanh bền vững cần đạt **LTV : COCA ≥ 3 : 1**.

- Dưới 3 : 1: chi quá nhiều để có khách, khó có lãi.
- **Dự án:** 6,94 : 1 (thời điểm 1) → 13,06 : 1 → **17,86 : 1** (thời điểm 3).
- Slide 21.

### NPV: Giá trị hiện tại ròng
*Net Present Value.*

Tổng giá trị hiện tại của **toàn bộ dòng tiền** dự án, từ năm 0 đến năm N, chiết khấu theo suất sinh lợi yêu cầu r. Tiền ở tương lai đáng giá ít hơn tiền hôm nay, nên phải quy đổi về năm 0 rồi mới cộng.

```
NPV = Σ (t = 0 → N)  CF(t) / (1 + r)^t
```

- **NPV ≥ 0:** dự án đạt mức sinh lời kỳ vọng r, đáng đầu tư.
- **NPV < 0:** chưa đạt mức kỳ vọng.
- Trong Excel: `=CF0 + NPV(r; CF1:CFN)`.
- **Dự án** (r = 12%): **3.124,7 triệu** nếu chỉ tính 5 năm hoạt động; **23.302,0 triệu** nếu cộng giá trị sau cuối CFT.
- Slide 23, 30–31.

### IRR: Suất sinh lợi nội tại
*Internal Rate of Return.*

Mức chiết khấu làm cho NPV đúng bằng 0, tức tỷ suất lợi nhuận bình quân mỗi năm mà dự án tự tạo ra. IRR = 12% nghĩa là khoản đầu tư sinh lời 12% mỗi năm trong suốt thời gian dự án.

```
0 = Σ (t = 0 → N)  CF(t) / (1 + IRR)^t
```

- **IRR ≥ r:** khả thi về tài chính.
- Không giải tay được, phải thử dần hoặc dùng hàm `IRR()` trong Excel.
- **Dự án:** **64,46%** (5 năm) hoặc 121,19% (gồm CFT), đều lớn hơn r = 12%.
- Slide 23, 30.

### PP: Thời gian hoàn vốn
*Payback Period.*

Số năm cần để dòng tiền thu về bù đủ vốn đầu tư ban đầu. Excel không có hàm sẵn.

```
PP = Năm t + (Chi phí còn phải thu hồi / Dòng tiền năm t+1)
```

- **Năm t:** năm cuối cùng mà dòng tiền tích lũy còn âm.
- **Phân số:** phần lẻ của năm.
- **PP ≤ thời gian hoàn vốn yêu cầu:** dự án được xem là phù hợp.
- **Dự án:** PP = 2 + 174,0 / 1.300,6 ≈ **2,13 năm** (khoảng 2 năm 2 tháng), nhỏ hơn yêu cầu 3 năm.
- Slide 24, 31.

---

## 2. Thành phần trong công thức

| Ký hiệu | Tên | Ý nghĩa | Giá trị trong dự án |
|---|---|---|---|
| **t** | Thời điểm | Số năm tính từ năm 0 (lúc bắt đầu) | 0 → 5 |
| **N** | Thời kỳ phân tích | Tổng số năm phân tích | 5 năm |
| **i** | Suất sinh lợi tối thiểu | Tỷ lệ chiết khấu dùng khi tính LTV | 15% |
| **r** (trong LTV) | Tỷ lệ duy trì | Phần trăm khách còn mua tiếp mỗi năm | 80%/năm |
| **rᵗ** | Tỷ lệ duy trì tích lũy | Phần trăm khách còn lại sau t năm | 100% → 32,77% ở năm 5 |
| **1/(1+i)ᵗ** | Hệ số giá trị hiện tại (PV factor) | Giá trị hôm nay của 1 đồng nhận ở năm t | 1,0000 → 0,4972 |
| **r** (trong NPV) | Suất chiết khấu, suất sinh lợi yêu cầu | Lãi suất nhà đầu tư mong muốn; cũng phản ánh chi phí cơ hội của vốn | 12%/năm |
| **g** | Tốc độ tăng trưởng vĩnh viễn | Mức tăng dòng tiền mỗi năm sau năm cuối phân tích | 5%/năm |
| **TMSE** | Total Marketing & Sales Expenses | Tổng chi phí tiếp thị và bán hàng trong kỳ | 600 / 850 / 1.100 triệu |
| **IBSE** | Install Base Support Expense | Chi phí chăm sóc, hỗ trợ khách hàng đã có; bị trừ ra vì không dùng để kéo khách mới | 60 / 180 / 400 triệu |
| **NC** | New Customers | Số khách hàng mới có được trong kỳ | 150 / 350 / 500 khách |

> **Lưu ý:** chữ **r** mang hai nghĩa khác nhau. Trong LTV, r là *tỷ lệ duy trì khách hàng*. Trong NPV, r là *suất chiết khấu*. Bài giảng dùng cùng một chữ cho cả hai.

### Giá trị hiện tại (PV)
*Present Value.* Giá trị hôm nay của một khoản tiền sẽ nhận trong tương lai: PV = Tiền ở năm t × 1/(1+i)ᵗ. Với i = 15%, 1 đồng lợi nhuận ở năm 5 chỉ đáng khoảng 0,50 đồng hôm nay.

### Lợi nhuận gộp và biên lợi nhuận gộp
- **Lợi nhuận gộp:** doanh thu trừ giá vốn hàng bán, chưa trừ chi phí bán hàng và quản lý.
- **Biên lợi nhuận gộp:** lợi nhuận gộp chia doanh thu.
- **Dự án:** phô mai 50%, whey 70%. Whey có biên cao hơn vì nguyên liệu là phụ phẩm của quá trình làm phô mai.

---

## 3. Dòng tiền

### CF: Dòng tiền
*Cash Flow.* Tiền mặt thực thu trừ tiền mặt thực chi trong một năm, tính vào cuối năm.

- **Dòng tiền hoạt động** = Doanh thu − Chi phí vận hành.
- **Dự án:** +300 triệu (năm 1) → +2.370,6 triệu (năm 5).

### Chi phí đầu tư ban đầu
Khoản chi một lần ở năm 0 để bắt đầu hoạt động: máy đông tụ, máy ly tâm, hệ thống cô đặc và sấy lạnh, kho lạnh, giấy phép, thương hiệu, bao bì.

- **Dự án:** 1.200 triệu. Khoản này ghi âm trong dòng tiền.

### CFT: Giá trị sau cuối
*Terminal Value.* Giá trị của toàn bộ dòng tiền **sau năm cuối cùng phân tích**, với giả định dòng tiền tăng đều g mỗi năm mãi mãi. Thay vì cộng vô hạn năm, công thức Gordon gom tất cả về một con số đặt tại năm N.

```
CF(N+1) = CF(N) × (1 + g)
CFT     = CF(N+1) / (r − g)        (chỉ có nghĩa khi r > g)
```

- **Dự án:** CF6 = 2.370,6 × 1,05 = 2.489,13 triệu; CFT = 2.489,13 / 7% = **35.559,0 triệu**.
- CFT chiếm khoảng 87% NPV, nên nhóm trình bày thêm kết quả không gồm CFT cho thận trọng.
- Slide 29.

### CF phân tích
Dòng tiền dùng để tính NPV và IRR: vốn đầu tư năm 0, dòng tiền hoạt động các năm, và cộng CFT vào năm cuối.

- **Dự án:** năm 5 = 2.370,6 + 35.559,0 = 37.929,6 triệu.

### CF tích lũy
Cộng dồn dòng tiền từ năm 0 đến năm đang xét. Năm đầu tiên CF tích lũy chuyển từ âm sang dương là năm thu hồi đủ vốn. Bài giảng tính PP trên dòng tích lũy **không gồm** CFT.

- **Dự án:** −1.200 → −900 → −174 → **+1.126,6** (năm 3).

### Chiết khấu
Quy đổi tiền tương lai về giá trị hôm nay bằng cách chia cho (1 + suất chiết khấu)ᵗ. Lý do: tiền hôm nay có thể đem đầu tư sinh lời, nên đáng giá hơn cùng số tiền đó trong tương lai.

---

## 4. Chi phí

### Chi phí một lần
Phát sinh một lần, thường ở năm 0, ví dụ đầu tư máy móc và giấy phép.

### Chi phí định kỳ
Lặp lại hằng tháng, quý hoặc năm. Dự án có 5 khoản: thuê xưởng và cửa hàng, nguyên liệu và bao bì, lương nhân viên, lương quản lý và R&D, tiện ích và tiếp thị.

### Chi phí chìm
*Sunk cost.* Khoản đã chi và không thu hồi được. **Không đưa vào dòng tiền dự án**, vì làm hay không làm dự án thì khoản đó cũng đã mất.

- **Dự án:** tiền làm hũ mẫu 200 gam và lô MVP 100 hũ đã chi trước khi lập dự án.

### Chi phí cơ hội
*Opportunity cost.* Lợi ích bị bỏ lỡ khi chọn phương án này thay vì phương án khác.

- **Dự án:** 1,2 tỷ đồng nếu đầu tư nơi khác cũng sinh lời. Phần này được phản ánh qua suất chiết khấu r = 12%.

### R&D
*Research & Development.* Nghiên cứu và phát triển, như công thức, hương vị, quy trình sản xuất.

---

## 5. Doanh thu và định giá

### Mô hình doanh thu
*Revenue model.* Cách doanh nghiệp quản lý các **dòng doanh thu** (revenue stream) bên trong mô hình kinh doanh. Một số cách tạo dòng doanh thu:
- bán hoặc cho thuê sản phẩm;
- thu phí dịch vụ, phí thuê bao;
- cấp phép, nhượng quyền;
- phí môi giới, quảng cáo.

### Các mô hình doanh thu trong dự án

| Thuật ngữ | Nghĩa | Trong dự án |
|---|---|---|
| **Bán trực tiếp** (Direct sales, Transactional) | Bán đứt theo từng giao dịch | Phô mai, whey bán lẻ và bán buôn. **Nhóm chọn** |
| **Thuê bao** (Subscription) | Khách trả phí định kỳ để nhận hàng đều đặn | Gói whey 1/3/6 tháng, hộp phô mai giao hằng tuần. **Nhóm chọn** |
| **Bán sỉ nguyên liệu** (Bulk, OEM) | Bán nguyên liệu số lượng lớn cho nhà sản xuất khác | Whey thô, phô mai nguyên khối cho nhà máy |
| **Nhượng quyền** (Franchising) | Cho bên khác dùng thương hiệu và mô hình cửa hàng, thu phí | Khi chuỗi cửa hàng đã có chỗ đứng |

### Kênh bán hàng
- **B2C** (Business to Consumer): bán cho người tiêu dùng cuối.
- **B2B** (Business to Business): bán cho doanh nghiệp như nhà hàng, tiệm bánh, khách sạn, siêu thị.
- **OEM** (Original Equipment Manufacturer): sản xuất hoặc cung cấp nguyên liệu để doanh nghiệp khác dùng hoặc bán dưới thương hiệu của họ.

### Cơ chế giá
- **Giá cố định:** giá niêm yết; giá theo tính năng, phân khúc khách hàng hoặc khối lượng.
- **Giá linh hoạt:** thương lượng, đấu giá, theo giá thị trường, theo tồn kho và thời gian.

### Các cách định giá

| Thuật ngữ | Nghĩa | Trong dự án |
|---|---|---|
| **Định giá theo giá trị** (Value-based pricing) | Đặt giá theo giá trị khách nhận được, không cộng lãi trên chi phí | Định vị phô mai tươi cao cấp |
| **Định giá cao trước, giảm sau** | Niêm yết cao để định vị, sau đó chiết khấu linh hoạt | Bài giảng khuyên tránh định giá thấp rồi phải tăng giá |
| **Giá neo** (Anchor price) | Mức giá tham chiếu để khách so sánh | Whey 850.000 ₫/kg, dưới hàng nhập 0,9–1,2 triệu |
| **Giá theo khối lượng** (Volume pricing) | Mua càng nhiều đơn giá càng thấp | B2B: 320.000 ₫/kg (5–19 kg), 280.000 ₫/kg (từ 20 kg) |
| **Combo** (Bundling) | Bán gộp nhiều sản phẩm với giá rẻ hơn mua lẻ | Phô mai + whey 820.000 ₫, tiết kiệm 150.000 ₫ |
| **Tiếp thị liên kết** (Affiliate) | Người giới thiệu có mã giảm giá riêng cho người theo dõi | Mã giảm 10% cho học viên của PT, KOL |
| **Sachet** | Gói nhỏ dùng một lần, giá thấp để dùng thử | Gói whey 30 g giá 35.000 ₫ |

---

## 6. Khách hàng và thị trường

### Năm nhóm khách hàng công nghệ
Chia khách hàng theo thời điểm họ chấp nhận sản phẩm mới:

| Nhóm | Đặc điểm |
|---|---|
| **Tín đồ công nghệ** (Innovators, Tech enthusiasts) | Mua đầu tiên, yêu công nghệ, sẽ mua bất kỳ thứ gì |
| **Người tiếp nhận sớm** (Early adopters) | Không nhạy cảm giá, muốn món hàng đặc biệt, kỳ vọng được quan tâm và có dịch vụ bổ sung |
| **Số đông chấp nhận sớm** (Early majority, Pragmatists) | Giúp doanh nghiệp có quy mô thật; điểm giá mà hầu hết mọi người nghĩ tới |
| **Số đông chấp nhận trễ** (Late majority, Conservatives) | Đến khi giá đã rõ; thích kế hoạch rõ ràng, chắc chắn |
| **Người bảo thủ** (Laggards, Skeptics) | Được tính đến sau cùng |

### Khách hàng đến sớm và đến sau
- **Đến sớm:** người tập gym, người ăn Eat Clean hoặc Keto, PT và KOL sức khỏe. Ít nhạy cảm giá.
- **Đến sau:** hộ gia đình, người tiêu dùng phổ thông, người mới tập, khách B2B. Nhạy cảm giá hơn.

### Khách hàng dẫn đường
Người có ảnh hưởng mạnh tới quyết định mua của người khác trong ngành. Bài giảng khuyên có chính sách giá riêng cho nhóm này.
- **PT** (Personal Trainer): huấn luyện viên cá nhân.
- **KOL** (Key Opinion Leader): người có tiếng nói trong cộng đồng.

### Tỷ lệ duy trì
*Retention rate.* Phần trăm khách còn tiếp tục mua ở kỳ sau.

### Đơn vị ra quyết định mua
Người hoặc nhóm người thực sự quyết định việc mua hàng. Ví dụ ở B2B là chủ nhà hàng hoặc bếp trưởng, không phải người dùng cuối.

### Các khái niệm thị trường

| Thuật ngữ | Nghĩa | Trong dự án |
|---|---|---|
| **Thị trường tiền tiêu** (Beachhead market) | Thị trường đầu tiên được chọn để chiếm lĩnh, làm bàn đạp sang thị trường lân cận | Gymer và sinh viên tập thể thao tại TP.HCM dùng whey nội địa giá tốt |
| **TAM** (Total Addressable Market) | Tổng doanh thu tiềm năng nếu chiếm 100% thị trường tiền tiêu | Khoảng 725 tỷ đồng/năm (báo cáo khả thi thị trường) |
| **Người dùng cuối** (End user) | Người thực sự dùng sản phẩm | |
| **Chân dung khách hàng** (Persona) | Một khách hàng điển hình được mô tả cụ thể | Minh, sinh viên năm 3, tập gym 5 buổi/tuần |
| **Truyền miệng** (Word-of-mouth) | Khách tự giới thiệu cho nhau, giúp COCA giảm theo thời gian | |

### Phân loại sản phẩm tiêu dùng
- **FMCG** (Fast-Moving Consumer Goods): hàng tiêu dùng nhanh, mua thường xuyên, giá thấp, vòng quay nhanh. Phô mai tươi thuộc nhóm này.

---

## 7. Sản phẩm

| Thuật ngữ | Nghĩa |
|---|---|
| **Whey** (nước whey) | Phần nước tách ra khi đông tụ sữa làm phô mai. Thường là phụ phẩm; dự án chế biến thành bột đạm |
| **Whey Protein** | Bột đạm cô đặc từ nước whey, dùng bổ sung protein cho người tập luyện |
| **WPC** (Whey Protein Concentrate) | Whey cô đặc. Sản phẩm dự kiến là WPC 80%, tức khoảng 80% là đạm |
| **Đông tụ** | Làm sữa kết tủa bằng men để tách phần đặc (phô mai) và phần lỏng (whey) |
| **COA** (Certificate of Analysis) | Phiếu kiểm định thành phần do phòng thí nghiệm độc lập cấp; sản phẩm có mã QR để tra cứu |
| **MVP** (Minimum Viable Product) | Sản phẩm khả thi tối thiểu, chỉ có tính năng cốt lõi để thử với khách thật. Dự án làm lô 100 hũ MVP |
| **VSATTP** | Vệ sinh an toàn thực phẩm (giấy phép cần có trước khi bán) |

---

## 8. Bảng tra nhanh

| Chỉ số | Hỏi điều gì | Tiêu chí đạt | Kết quả dự án | Đạt? |
|---|---|---|---|---|
| **LTV** | Một khách mang lại bao nhiêu lợi nhuận gộp trong 5 năm? | Càng cao càng tốt | 24.996.592 ₫ | |
| **COCA** | Có một khách mới tốn bao nhiêu? | Càng thấp càng tốt | 3,6 → 1,4 triệu ₫ | |
| **LTV : COCA** | Khách mang về gấp mấy lần chi phí có khách? | ≥ 3 : 1 | 6,94 → 17,86 : 1 | Đạt |
| **NPV** | Sau khi chiết khấu, dự án tạo thêm bao nhiêu giá trị? | ≥ 0 | 3.124,7 triệu (5 năm) | Đạt |
| **IRR** | Dự án sinh lời bao nhiêu % mỗi năm? | ≥ r = 12% | 64,46% (5 năm) | Đạt |
| **PP** | Bao lâu thì thu hồi đủ vốn? | ≤ 3 năm | 2,13 năm | Đạt |

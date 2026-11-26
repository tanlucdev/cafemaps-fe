# Phân gói Cafe Maps

## Đề xuất cho lần thử đầu

Dùng hai gói cho người đi cà phê. **Miễn phí** để tìm, chọn, lưu quán và tạo hẹn. **Cafe Maps Pass** gồm xem nội dung quán mở rộng không giới hạn, bản đồ tương tác và mở bình chọn quán cho buổi hẹn. Thử mức **10.000₫ cho 30 ngày**, thanh toán một lần qua PayOS. Nhánh hiện mới có luồng thanh toán cho quyền xem chi tiết. Nếu dùng luồng này để thử nhu cầu trước, chỉ công bố quyền xem chi tiết trong đợt thử.

| Nhóm tính năng | Miễn phí | Cafe Maps Pass |
| --- | --- | --- |
| Tìm quán | Tìm kiếm, lọc theo khu vực, vibe, mục đích, giá và giờ mở cửa. Tìm gần đây theo vị trí, xem danh sách chuỗi và gợi ý cùng vibe. | Cùng quyền. |
| Chọn quán và đi quán | Tên, ảnh bìa, mô tả ngắn, địa chỉ, giờ mở cửa, khoảng giá, tiện ích, thông tin gửi xe, chỉ đường, điểm và bài đánh giá, chia sẻ link. | Cùng quyền. |
| Khám phá kỹ trước khi đi | Xem thêm ảnh, ảnh menu và ghi chú tuyển chọn của tối đa 10 quán khác nhau mỗi tháng. | Xem các mục này ở mọi quán có nội dung trong 30 ngày. |
| Tài khoản cá nhân | Lưu quán, quiz, danh sách quán đã đi, lịch sử xem và tạo hẹn cơ bản. | Thêm bản đồ tương tác và quyền mở bình chọn quán. |
| Cộng đồng | Đọc đánh giá công khai. Viết đánh giá, vote, góp ý và đề xuất quán theo quyền hiện có. | Cùng quyền. |
| Chủ quán | Gửi tối đa 3 hồ sơ quán mới khác nhau mỗi tháng để duyệt. Cập nhật hồ sơ đã có vẫn miễn phí theo quy trình duyệt. | Pass dành cho người đi cà phê. Tài khoản chủ quán giữ hạn mức gửi hồ sơ. |

Ảnh và ghi chú tuyển chọn là lý do mua đáng thử với người thường xuyên khám phá quán. Quán chỉ có ảnh bìa hoặc thông tin cơ bản không nên tiêu một lượt. Tìm quán, chỉ đường và đọc đánh giá giúp người mới thấy giá trị ngay khi vào từ Google hoặc link được chia sẻ. Giữ lưu quán, viết đánh giá và góp quán miễn phí để người dùng có lý do quay lại và dữ liệu tiếp tục được cập nhật.

## Nhánh đang làm gì

- Backend có chế độ `measure` để phục vụ chi tiết và ghi nhận lượt mở, cùng chế độ `enforce` để áp hạn mức. Trong `enforce`, lượt miễn phí tính theo quán khác nhau trong tháng theo giờ Việt Nam. Khách được đếm theo trình duyệt, tài khoản theo người dùng. Lượt khách được gộp vào hạn mức tài khoản khi đăng nhập. Quán đã mở bằng lượt miễn phí có thể mở lại trong cùng tháng.
- Pass hiện cấp 30 ngày theo tài khoản sau xác nhận thanh toán. Khách cần đăng nhập trước khi mua. Quyên góp vẫn là một luồng riêng.
- Trang hiện gọi mở chi tiết tự động khi vào URL. Khi hết lượt, trang chỉ hiện bản xem trước và gợi ý cùng vibe. Giờ, giá, tiện ích và địa chỉ Google Maps đã có trong dữ liệu xem trước ở backend nhưng chưa được hiển thị đầy đủ. Chỉ đường, đánh giá, chia sẻ và một số thao tác cộng đồng hiện nằm trong phần chi tiết đầy đủ.
- Kết luận trên dựa vào mã nguồn frontend và backend cùng nhánh. Chưa có số liệu hành vi, doanh thu hoặc xác minh cấu hình production trong đợt đánh giá này.

## Triển khai cùng backend

Frontend gọi `POST /cafes/:slug/detail-access` để mở trang chi tiết. Triển khai backend hỗ trợ endpoint này và các migration quyền truy cập, thanh toán trước frontend. Kiểm tra khách mới nhận cookie qua phản hồi `428`, rồi nhận chi tiết qua `200` khi gọi lại. Dùng chế độ `measure` cho lần triển khai đầu.

## Điều kiện trước khi bật giới hạn

1. Hiện thông tin miễn phí và các thao tác chính ngay trên trang quán. Chỉ gọi mở nội dung đầy đủ khi người dùng chọn **Xem thêm ảnh và menu**. Ghi rõ số lượt còn lại cạnh nút, giữ nguyên trang quán khi hết lượt.
2. Giữ bản xem trước công khai và sitemap để người dùng tìm được quán. Kiểm tra quyền ở backend cho nội dung trả phí. Rà HTML, dữ liệu nhúng, bản markdown và các API danh sách để bảo đảm chúng chỉ trả dữ liệu công khai, đồng thời kiểm tra người đã mua mở được nội dung trên thiết bị khác sau đăng nhập.
3. Chạy `measure` ít nhất một chu kỳ tháng đầy đủ sau khi có nút mở riêng. Đo tỷ lệ người chủ động mở hơn 10 quán, tách khách và tài khoản bằng quy tắc gộp lượt hiện có. Lượt vào URL từ triển khai hiện tại chỉ phản ánh lượng trang được mở, chưa phản ánh nhu cầu xem thêm ảnh và menu.
4. Thử `enforce` trên một nhóm nhỏ và giữ nhóm `measure` để so sánh. Theo dõi tỷ lệ xác nhận thanh toán trên số tài khoản thấy đề nghị mua, doanh thu sau phí và hoàn tiền, tỷ lệ mở chỉ đường, lưu quán và quay lại sau 7 ngày. Chốt ngưỡng chấp nhận dựa trên số liệu gốc trước khi thử. Mở rộng nếu doanh thu bù chi phí vận hành bổ sung và các hành vi miễn phí giữ trong ngưỡng.

5. Kiểm tra hạn mức và lượt tải Mapbox trên tài khoản nhà cung cấp. Chỉ khởi tạo bản đồ tương tác sau khi xác nhận có Pass và người dùng chọn mở bản đồ. Theo dõi lượt tải trên mỗi tài khoản có Pass để dự trù chi phí.

## Lưu quán, quiz, bản đồ và hẹn cà phê

Giữ lưu quán, quiz và tạo hẹn cơ bản miễn phí. Đưa bản đồ tương tác vào Pass vì lượt tải Mapbox tiêu hạn mức. Dùng danh sách quán đã đi để người dùng miễn phí vẫn xem lại dữ liệu của mình.

| Tính năng | Miễn phí | Pass hoặc mở rộng sau | Lý do |
| --- | --- | --- | --- |
| Lưu quán | Lưu, bỏ lưu, tạo và quản lý thư mục cá nhân. Đăng nhập để dùng. | Danh sách nhóm cùng thêm quán và bình chọn. Người được mời có thể tham gia miễn phí. | Bộ sưu tập cá nhân giúp người dùng quay lại. Chọn quán chung giải quyết việc phối hợp cả nhóm. |
| Quiz | Làm quiz, xem kết quả, nhận gợi ý quán, tải ảnh kết quả. Lưu lịch sử khi đăng nhập. | Giữ miễn phí. | Quiz đưa người dùng đến quán phù hợp và tạo nội dung dễ chia sẻ. Chưa thấy nhu cầu đủ rõ cho một phần quiz riêng có phí. |
| Bản đồ nhỏ | Đánh dấu đã đi, xem danh sách quán đã đi và mở chỉ đường. | Mở bản đồ tương tác Mapbox để xem các quán đã đi. | Quyền tải bản đồ đi cùng Pass để ngân sách Mapbox tập trung vào người dùng trả phí. |
| Hẹn cà phê | Tạo hẹn, gửi thiệp cơ bản, xem lời mời, xin tham gia và duyệt người tham gia theo quyền hiện có. Tính năng phụ thuộc cờ Coffee Meetups. | Người tổ chức mở bình chọn giữa nhiều quán. Người được mời xem và bình chọn miễn phí. | Tham gia dễ giúp lời mời có phản hồi. Người tổ chức có lý do trả tiền nếu việc chốt quán và giờ mất nhiều công. |

**Bình chọn quán cho buổi hẹn.** Người tổ chức có Pass chọn vài quán từ danh sách đã lưu, gửi một link cho nhóm rồi chốt quán theo phiếu. Chỉ cần người mở bình chọn có Pass. Thử luồng này trước khi xây thư mục cộng tác, bình chọn giờ hoặc lập lộ trình. Xem tỷ lệ người nhận lời mời có bình chọn và tỷ lệ buổi hẹn chốt được quán để quyết định có giữ quyền lợi này trong Pass hay không. Khi Pass hết hạn, tài khoản vẫn xem lại quán đã lưu, danh sách quán đã đi và các buổi hẹn đã tạo.

## Hạn mức gửi hồ sơ của chủ quán

Thử **3 quán mới khác nhau mỗi tài khoản chủ quán mỗi tháng**, theo giờ Việt Nam. Tính một lượt khi backend nhận hồ sơ mới để duyệt. Lưu nháp, bổ sung rồi gửi lại cùng hồ sơ, và cập nhật địa chỉ, giờ mở cửa, ảnh hoặc menu của quán đã có đều không tiêu lượt mới. Chủ chuỗi cần gửi thêm chi nhánh có thể liên hệ để xử lý theo lô. Theo dõi số hồ sơ chờ duyệt và số chủ quán chạm hạn mức trước khi định giá lượt bổ sung.

**Chủ quán** có thể trả cho chiến dịch hiển thị có nhãn tài trợ và báo cáo lượt xem, lưu, bấm chỉ đường. Đây là sản phẩm riêng cho chủ quán. Thông tin hồ sơ cơ bản và thứ hạng tự nhiên theo độ phù hợp vẫn công khai.

## Mã nguồn tham chiếu

- Frontend · [Trang quán](../app/%5Blocale%5D/%28main%29/cafe/%5Bslug%5D/page.tsx), [trạng thái truy cập](../app/%5Blocale%5D/%28main%29/cafe/%5Bslug%5D/_components/CafeDetailAccess.tsx), [nội dung chi tiết](../app/%5Blocale%5D/%28main%29/cafe/%5Bslug%5D/_components/CafeDetailContent.tsx), [luồng thanh toán](../apis/payments/index.ts).
- Backend cùng nhánh · `src/cafe-detail-access/cafe-detail-access.service.ts`, `src/cafes/cafes.service.ts`, `src/payments/payments.service.ts`.

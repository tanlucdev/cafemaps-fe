import { Link } from "@/i18n/navigation";
import { normalizeLocale } from "@/lib/metadata";

type HomeSeoContentProps = {
  locale: string;
};

type SeoContent = {
  eyebrow: string;
  title: string;
  intro: string[];
  areaTitle: string;
  areas: Array<{ title: string; body: string }>;
  useCaseTitle: string;
  useCases: Array<{ title: string; body: string }>;
  guideTitle: string;
  guide: string[];
  timingTitle: string;
  timings: Array<{ title: string; body: string }>;
  detailTitle: string;
  details: Array<{ title: string; body: string }>;
  planningTitle: string;
  planning: string[];
  faqTitle: string;
  faqs: Array<{ question: string; answer: string }>;
  closingTitle: string;
  closing: string[];
  exploreLabel: string;
  blogLabel: string;
};

const content: Record<"vi" | "en", SeoContent> = {
  vi: {
    eyebrow: "Cẩm nang cà phê TP.HCM",
    title: "Chọn quán cà phê hợp mood, hợp lịch, hợp khu vực",
    intro: [
      "TP.HCM có rất nhiều quán cà phê đẹp, nhưng một quán hợp thật sự không chỉ nằm ở ảnh chụp. Có ngày bạn cần bàn rộng, ổ cắm dễ tìm và nhạc vừa đủ nhỏ để tập trung. Có ngày chỉ cần một góc sáng, ly cà phê ổn, chỗ ngồi không quá sát nhau để trò chuyện với bạn bè. Cafe Maps được xây như một bản đồ nhỏ cho những nhu cầu rất đời thường đó: tìm quán theo khu vực, phong cách, mục đích ghé quán và trạng thái mở cửa.",
      "Khi tìm quán cà phê ở TP.HCM, hãy bắt đầu từ việc bạn muốn ở lại bao lâu. Một buổi làm việc hai đến ba tiếng sẽ cần tiêu chí khác với một cuộc hẹn nhanh sau bữa tối. Quán có ánh sáng đẹp chưa chắc phù hợp để họp online; quán yên tĩnh buổi sáng có thể đông hơn vào cuối tuần. Vì vậy, một danh sách tốt nên giúp bạn đọc nhanh bối cảnh: quận nào tiện di chuyển, vibe nào nổi bật, có phù hợp làm việc không, có nhiều góc chụp hình không, có ngoài trời hay không, và khoảng giá có hợp kế hoạch hôm đó không.",
      "Nếu bạn đang lên lịch cho một buổi cà phê đầu tiên, hãy ưu tiên quán dễ tìm, có chỗ ngồi thoải mái, không quá ồn và nằm gần điểm hẹn tiếp theo. Nếu bạn đi một mình, những quán có bar ngồi, cửa sổ nhìn ra đường hoặc bàn nhỏ cạnh tường thường dễ chịu hơn những không gian quá mở. Nếu bạn đi nhóm, hãy kiểm tra khu vực bàn dài, chỗ gửi xe và giờ cao điểm. Những chi tiết nhỏ này giúp buổi cà phê trôi chảy hơn rất nhiều.",
    ],
    areaTitle: "Gợi ý nhanh theo khu vực",
    areas: [
      {
        title: "Quận 1 và trung tâm",
        body: "Phù hợp cho lịch hẹn sau giờ làm, gặp khách, cà phê nhanh trước khi đi ăn hoặc tìm một quán có thiết kế nổi bật. Khu trung tâm thường có nhiều lựa chọn specialty coffee, rooftop, quán trong hẻm nhỏ và không gian mang hơi hướng boutique. Khi chọn quán ở đây, nên để ý phí gửi xe, tiếng ồn và thời điểm đông khách, nhất là chiều tối hoặc cuối tuần.",
      },
      {
        title: "Quận 3, Phú Nhuận và Tân Bình",
        body: "Hợp với người muốn không khí Sài Gòn quen thuộc hơn: nhà cũ, sân vườn nhỏ, quán rang xay, hẻm yên tĩnh và giá dễ chịu. Đây là nhóm khu vực tốt cho làm việc ngắn, đọc sách, gặp bạn thân hoặc tìm quán không quá xa sân bay. Nhiều quán đẹp nằm trong hẻm nên hãy xem địa chỉ kỹ trước khi đi.",
      },
      {
        title: "Thảo Điền và khu Đông",
        body: "Thường có nhiều quán rộng, nhiều cây xanh, brunch cafe, không gian ngoài trời và phong cách quốc tế. Khu này hợp cho cuối tuần, hẹn hò, đi cùng thú cưng hoặc những buổi cần ngồi lâu. Một số quán có giá cao hơn mặt bằng chung, đổi lại là không gian thoáng, menu đa dạng và trải nghiệm thư giãn hơn.",
      },
      {
        title: "Bình Thạnh và khu gần trung tâm",
        body: "Là lựa chọn cân bằng khi bạn muốn đi nhanh từ Quận 1, Quận 2 hoặc Phú Nhuận. Có nhiều quán nhỏ, quán specialty, quán view kênh, quán yên tĩnh trong hẻm và không gian phù hợp làm việc. Nếu muốn tránh đông, hãy ưu tiên buổi sáng hoặc đầu giờ chiều trong tuần.",
      },
    ],
    useCaseTitle: "Chọn theo mục đích ghé quán",
    useCases: [
      {
        title: "Làm việc và học tập",
        body: "Ưu tiên bàn vững, ghế ngồi lâu không mỏi, wifi ổn, ổ cắm dễ tiếp cận, ánh sáng không quá gắt và nhạc nền vừa phải. Nếu cần gọi video, hãy chọn quán có nhiều góc riêng hoặc tầng lầu ít người qua lại. Một quán work-friendly tốt không nhất thiết phải im tuyệt đối, nhưng cần có nhịp ổn định để bạn không bị phân tâm liên tục.",
      },
      {
        title: "Hẹn hò và trò chuyện",
        body: "Hãy tìm quán có khoảng cách bàn dễ chịu, ánh sáng ấm, menu không quá khó chọn và vị trí thuận tiện cho cả hai. Những quán có sân nhỏ, ban công, cửa sổ lớn hoặc góc ngồi cạnh cây xanh thường tạo cảm giác nhẹ nhàng hơn. Tránh các khung giờ quá đông nếu bạn muốn cuộc trò chuyện tự nhiên.",
      },
      {
        title: "Chụp ảnh và khám phá không gian",
        body: "Quán đẹp để chụp hình thường có ánh sáng tự nhiên, màu vật liệu rõ, vài góc signature và lối đi không quá chật. Nên đi buổi sáng hoặc đầu giờ chiều để ánh sáng ổn định hơn. Nếu quán nhỏ, hãy gọi món trước, chọn góc gọn gàng và tránh làm ảnh hưởng đến khách khác.",
      },
      {
        title: "Đi một mình",
        body: "Một buổi cà phê một mình sẽ dễ chịu hơn ở quán có bàn đơn, quầy bar, cửa sổ nhìn ra phố hoặc khu ngồi ngoài trời vừa đủ riêng tư. Các quán có playlist nhẹ, nhân viên thân thiện và menu cà phê rõ ràng thường tạo cảm giác an toàn, không bị lạc lõng khi bạn chỉ muốn ngồi đọc vài trang sách hoặc ghi chú vài ý tưởng.",
      },
    ],
    guideTitle: "Cách đọc nhanh một quán trước khi quyết định đi",
    guide: [
      "Đầu tiên, xem quán có đang mở hay không và giờ đóng cửa còn đủ lâu cho kế hoạch của bạn không. Một quán đóng trong 45 phút nữa không phù hợp cho làm việc, nhưng vẫn ổn nếu bạn chỉ cần một ly mang đi. Tiếp theo, đọc khu vực và tuyến đường. Ở TP.HCM, khoảng cách ngắn trên bản đồ vẫn có thể mất nhiều thời gian vào giờ cao điểm, nhất là khi phải băng qua trục đường lớn hoặc khu đang thi công.",
      "Sau đó, nhìn vào vibe chính của quán. Từ khóa như yên tĩnh, vintage, tối giản, ngoài trời, sân vườn, specialty, rooftop hay work-friendly giúp bạn lọc nhanh kỳ vọng. Một quán vintage có thể đẹp nhưng ánh sáng hơi tối; một quán tối giản có thể sạch mắt nhưng ít góc riêng; một quán sân vườn rất thư giãn nhưng không phải lúc nào cũng hợp mùa mưa. Đừng chỉ chọn theo ảnh đẹp nhất, hãy chọn theo hoàn cảnh bạn thật sự cần.",
      "Cuối cùng, hãy cân nhắc nhóm đi cùng. Đi với bạn làm việc cần ổ cắm và không gian ổn định; đi với gia đình cần lối đi rộng, chỗ ngồi thoải mái và menu dễ gọi; đi với người mới quen cần quán dễ tìm, không quá ồn và có phương án di chuyển tiếp theo. Khi các tiêu chí này rõ ràng, việc chọn quán trở nên nhanh hơn, ít hụt hẫng hơn và buổi cà phê cũng đáng nhớ hơn.",
    ],
    timingTitle: "Chọn quán theo khung giờ trong ngày",
    timings: [
      {
        title: "Buổi sáng",
        body: "Sáng sớm là thời điểm tốt để tìm quán có ánh sáng tự nhiên, không khí nhẹ và nhịp phục vụ ổn định. Nếu bạn muốn làm việc, hãy chọn quán mở sớm, có bàn gần cửa sổ nhưng không bị nắng gắt. Nếu chỉ muốn ăn sáng và uống cà phê, hãy ưu tiên nơi có menu rõ, phục vụ nhanh và nằm gần tuyến đường bạn cần đi tiếp. Buổi sáng cũng là lúc nhiều quán đẹp dễ chụp hơn vì chưa quá đông.",
      },
      {
        title: "Giờ trưa và đầu chiều",
        body: "Khoảng trưa hợp với quán mát, có máy lạnh tốt, ghế ngồi lâu không mỏi và không quá sát khu văn phòng ồn ào. Đây là khung giờ phù hợp để đọc sách, xử lý email, họp nhẹ hoặc nghỉ giữa ngày. Nếu đi nhóm, nên chọn quán có không gian rộng hơn vì nhiều nơi sẽ có khách văn phòng ghé nhanh. Một quán trưa tốt thường không cần quá nổi bật, nhưng cần ổn định và dễ chịu.",
      },
      {
        title: "Chiều muộn",
        body: "Chiều muộn là thời điểm nhiều quán chuyển từ nhịp làm việc sang nhịp hẹn gặp. Ánh sáng lúc này đẹp nhưng nhanh thay đổi, nên nếu bạn muốn chụp hình hãy đến sớm hơn một chút. Nếu cần trò chuyện, hãy tránh các quán quá nhỏ hoặc đang nổi trên mạng xã hội vì lượng khách có thể tăng nhanh. Các quán có ban công, sân nhỏ hoặc cửa sổ lớn thường tạo cảm giác thư giãn hơn trong khung giờ này.",
      },
      {
        title: "Buổi tối",
        body: "Tối phù hợp với quán có ánh sáng ấm, menu đồ uống không caffeine hoặc món nhẹ, chỗ ngồi riêng tư và tuyến đường dễ gọi xe. Nếu hẹn hò hoặc gặp bạn lâu ngày, hãy kiểm tra giờ đóng cửa để cuộc trò chuyện không bị cắt ngang. Một số quán trung tâm có không khí rất đẹp vào buổi tối nhưng cũng đông và ồn hơn, vì vậy hãy cân nhắc mục đích chính của buổi đi.",
      },
    ],
    detailTitle: "Những chi tiết nhỏ nhưng ảnh hưởng lớn đến trải nghiệm",
    details: [
      {
        title: "Âm thanh",
        body: "Tiếng nhạc, tiếng máy xay, tiếng trò chuyện và tiếng xe ngoài đường đều ảnh hưởng đến cảm nhận về quán. Một quán có playlist hay vẫn có thể không hợp làm việc nếu âm lượng quá lớn. Ngược lại, một quán nằm trong hẻm yên tĩnh có thể trở thành lựa chọn rất tốt cho đọc sách hoặc viết lách. Khi bạn cần tập trung, hãy ưu tiên mô tả yên tĩnh, bàn làm việc, khu tầng lầu hoặc không gian ít người qua lại.",
      },
      {
        title: "Ánh sáng",
        body: "Ánh sáng quyết định cả ảnh chụp lẫn cảm giác ở lại. Ánh sáng tự nhiên hợp buổi sáng và chụp hình; ánh sáng vàng hợp hẹn hò, trò chuyện và thư giãn; ánh sáng quá tối dễ mỏi mắt nếu đọc sách hoặc làm việc lâu. Những quán có cửa sổ lớn, giếng trời, sân nhỏ hoặc mặt tiền thoáng thường cho cảm giác dễ chịu hơn, nhưng cũng cần xem hướng nắng vào khung giờ bạn định đến.",
      },
      {
        title: "Bàn ghế",
        body: "Một chiếc ghế đẹp chưa chắc ngồi lâu thoải mái. Nếu bạn cần làm việc, hãy chú ý chiều cao bàn, độ cứng ghế, khoảng cách giữa các bàn và chỗ đặt laptop. Nếu đi hẹn hò, ghế sofa hoặc bàn nhỏ có thể ấm cúng hơn. Nếu đi nhóm, bàn dài và lối đi rộng quan trọng hơn background đẹp. Đây là lý do cùng một quán có thể rất hợp mục đích này nhưng lại không hợp mục đích khác.",
      },
      {
        title: "Menu và nhịp phục vụ",
        body: "Một menu tốt không chỉ có cà phê ngon mà còn có lựa chọn không caffeine, trà, nước trái cây hoặc món nhẹ cho người đi cùng. Nhịp phục vụ cũng quan trọng: quán đông nhưng vận hành tốt vẫn dễ chịu, còn quán đẹp nhưng chờ quá lâu có thể làm hỏng lịch trình. Khi lên kế hoạch trước, hãy chọn quán có phong cách menu phù hợp nhóm đi cùng để mọi người đều dễ gọi món.",
      },
      {
        title: "Di chuyển và gửi xe",
        body: "Ở TP.HCM, chuyện gửi xe và tuyến đường có thể quyết định bạn có muốn quay lại quán hay không. Quán trong hẻm yên tĩnh thường dễ chịu hơn nhưng có thể khó tìm; quán mặt tiền tiện thấy hơn nhưng có thể ồn hoặc khó dừng xe. Nếu đi vào cuối tuần, hãy tính thêm thời gian gửi xe, chờ bàn hoặc di chuyển sang điểm hẹn tiếp theo. Một quán gần đúng tuyến đường sẽ giúp buổi đi nhẹ hơn rất nhiều.",
      },
      {
        title: "Mức riêng tư",
        body: "Không gian riêng tư không nhất thiết phải là phòng kín. Đôi khi chỉ cần bàn không quá sát nhau, góc ngồi ít người đi qua hoặc âm lượng nền vừa phải. Với cuộc trò chuyện quan trọng, hãy ưu tiên quán có nhiều lớp không gian thay vì chỉ một phòng lớn. Với buổi làm việc cá nhân, một góc gần tường hoặc cạnh cửa sổ thường tạo cảm giác tập trung hơn so với bàn giữa lối đi.",
      },
    ],
    planningTitle: "Một cách lập kế hoạch cà phê nhẹ nhàng hơn",
    planning: [
      "Trước khi rời nhà, hãy tự hỏi ba câu: mình muốn ngồi bao lâu, mình cần yên tĩnh đến mức nào, và sau buổi cà phê mình sẽ đi đâu tiếp. Ba câu này giúp loại bỏ rất nhiều lựa chọn không phù hợp. Nếu chỉ có một tiếng, ưu tiên quán gần, dễ gửi xe và phục vụ nhanh. Nếu có cả buổi chiều, bạn có thể chọn một quán xa hơn một chút nhưng không gian đáng để ở lại.",
      "Với lịch làm việc, nên có một danh sách quán dự phòng theo từng khu. Một quán chính để tập trung, một quán phụ nếu quán đầu quá đông, và một quán gần điểm hẹn cuối ngày. Điều này đặc biệt hữu ích ở các khu trung tâm, nơi tình trạng hết bàn hoặc ồn bất ngờ xảy ra khá thường xuyên. Khi có phương án dự phòng, bạn bớt mất năng lượng vào việc quyết định lại từ đầu.",
      "Với cuối tuần, hãy chọn quán theo trải nghiệm thay vì chỉ theo khoảng cách. Có ngày nên đi xa hơn để tìm một sân vườn nhiều cây, một quán có brunch chậm rãi hoặc một không gian có nhạc nhẹ. Có ngày chỉ cần quán gần nhà, đồ uống quen miệng và một bàn đủ yên. Một bản đồ cà phê tốt nên giúp cả hai kiểu ngày đó trở nên dễ chọn hơn.",
      "Nếu bạn thích khám phá quán mới, hãy lưu lại lý do khiến một quán hợp với mình: ánh sáng, vị cà phê, thái độ phục vụ, góc ngồi, khu vực, mức giá hoặc cảm giác khi bước vào. Sau vài lần, bạn sẽ nhận ra pattern riêng của mình. Có người thích quán nhiều cây, có người thích quán tối giản, có người chỉ cần âm thanh vừa đủ và bàn ghế ổn. Hiểu pattern đó giúp mỗi lần tìm quán nhanh hơn mà vẫn có cảm giác mới mẻ.",
    ],
    faqTitle: "Câu hỏi thường gặp khi tìm quán cà phê",
    faqs: [
      {
        question: "Nên tìm quán cà phê gần tôi như thế nào?",
        answer: "Hãy bắt đầu bằng khu vực hiện tại, sau đó lọc thêm theo mục đích: làm việc, hẹn hò, đi một mình, ngoài trời hoặc yên tĩnh. Với các quận đông như Quận 1, Quận 3, Bình Thạnh hoặc Phú Nhuận, nên kiểm tra giờ mở cửa và thời điểm đông khách để tránh mất thời gian di chuyển.",
      },
      {
        question: "Quán cà phê yên tĩnh có phải lúc nào cũng hợp để làm việc không?",
        answer: "Không hẳn. Yên tĩnh là một tiêu chí quan trọng, nhưng làm việc còn cần bàn ghế ổn, wifi, ổ cắm, ánh sáng và thời gian ngồi phù hợp. Một quán rất yên nhưng bàn thấp hoặc ghế mềm có thể hợp đọc sách hơn là làm việc trên laptop.",
      },
      {
        question: "Nên đi quán cà phê đẹp ở TP.HCM vào khung giờ nào?",
        answer: "Buổi sáng thường có ánh sáng dễ chụp và ít đông hơn. Đầu giờ chiều hợp cho làm việc hoặc đọc sách. Chiều tối hợp hẹn hò nhưng nhiều quán trung tâm sẽ đông, nên đặt kỳ vọng về tiếng ồn và chỗ ngồi trước khi đi.",
      },
      {
        question: "Làm sao chọn quán cho buổi hẹn đầu?",
        answer: "Chọn nơi dễ tìm, không quá ồn, có ánh sáng ấm, chỗ ngồi không quá sát nhau và menu dễ gọi. Một vị trí gần nhà hàng, rạp phim hoặc tuyến đường dễ bắt xe sẽ giúp buổi hẹn linh hoạt hơn nếu hai bạn muốn đi tiếp sau cà phê.",
      },
      {
        question: "Có nên chỉ chọn quán theo hình ảnh không?",
        answer: "Không nên. Hình ảnh cho biết phong cách, nhưng trải nghiệm còn phụ thuộc giờ đi, độ đông, âm thanh, ánh sáng, chỗ gửi xe và mục đích của bạn. Hãy kết hợp ảnh với mô tả vibe, khu vực, tiện ích và đánh giá thực tế.",
      },
    ],
    closingTitle: "Cafe Maps giúp hành trình cà phê bớt ngẫu nhiên hơn",
    closing: [
      "Một thành phố nhiều quán như TP.HCM rất thú vị, nhưng cũng dễ khiến bạn mất thời gian chọn lựa. Khi mỗi quán được nhìn qua khu vực, phong cách, mục đích và trạng thái mở cửa, bạn có thể ra quyết định nhanh hơn mà vẫn giữ được cảm giác khám phá. Cafe Maps hướng tới việc gom những tín hiệu nhỏ đó lại trong một trải nghiệm gọn gàng: tìm quán hợp buổi sáng, quán đủ yên để làm việc, quán đẹp để gặp bạn, hoặc một góc mới để cuối tuần đổi không khí.",
      "Dù bạn thích cà phê sữa đá quen thuộc, espresso gọn gàng, cold brew nhẹ, latte nóng hay một món trà trái cây dễ uống, điều quan trọng nhất vẫn là không gian đúng lúc. Một quán phù hợp có thể làm buổi làm việc trơn tru hơn, cuộc trò chuyện ấm hơn và một ngày bình thường có thêm điểm dừng dễ nhớ.",
    ],
    exploreLabel: "Khám phá danh sách quán",
    blogLabel: "Đọc thêm kinh nghiệm chọn quán",
  },
  en: {
    eyebrow: "Ho Chi Minh City cafe guide",
    title: "Choose a cafe by mood, schedule, and neighborhood",
    intro: [
      "Ho Chi Minh City has thousands of cafes, but the right place is rarely just the one with the prettiest photo. Some days you need a steady table, accessible power outlets, reliable wifi, and music that stays in the background. Other days you only need warm light, a good drink, and enough space to talk without feeling rushed. Cafe Maps is built around those everyday decisions: where to go, what kind of atmosphere to expect, whether the cafe suits your plan, and whether it is still open when you are ready to leave.",
      "A good cafe search starts with the amount of time you want to spend there. A two-hour work session needs different conditions from a short coffee after dinner. A quiet cafe in the morning can become busy on weekends. A photogenic place may not be comfortable for a video call. Useful cafe information should help you scan the essentials quickly: neighborhood, vibe, seating, work suitability, outdoor space, price range, opening hours, and the kind of visit the cafe is best for.",
      "For a first coffee date, choose somewhere easy to find, comfortable, not too loud, and close to your next stop. For solo coffee, a window seat, a small table along the wall, or a bar counter can feel better than a large open room. For groups, check whether the cafe has long tables, parking, and enough breathing room during peak hours. Small details like these can turn a random cafe stop into a smooth plan.",
    ],
    areaTitle: "Quick notes by area",
    areas: [
      {
        title: "District 1 and the central area",
        body: "Best for after-work meetings, quick coffee before dinner, client catch-ups, and cafes with strong design identity. The central area has specialty coffee bars, rooftops, boutique-style rooms, hidden alley cafes, and polished spaces for visitors. Check parking, noise level, and peak hours before choosing, especially in the evening or on weekends.",
      },
      {
        title: "District 3, Phu Nhuan, and Tan Binh",
        body: "Good for a more local Saigon feeling: old houses, small courtyards, roasters, quiet alleys, and easier prices. These neighborhoods work well for short work sessions, reading, casual catch-ups, and coffee before or after an airport trip. Many good places sit inside smaller streets, so read the address carefully before heading out.",
      },
      {
        title: "Thao Dien and the eastern side",
        body: "Known for larger cafes, greenery, brunch spots, outdoor corners, and a more international rhythm. This side fits weekend plans, relaxed dates, pet-friendly visits, or longer stays. Some cafes are more expensive than average, but the tradeoff is often better spacing, a wider menu, and a calmer sense of escape.",
      },
      {
        title: "Binh Thanh and near-central neighborhoods",
        body: "A balanced choice when you want quick access from District 1, District 2, or Phu Nhuan. You can find small specialty bars, canal views, quiet alley cafes, and practical spaces for laptop work. To avoid the busiest moments, try morning or early afternoon on weekdays.",
      },
    ],
    useCaseTitle: "Choose by purpose",
    useCases: [
      {
        title: "Working or studying",
        body: "Prioritize stable tables, comfortable chairs, reliable wifi, nearby outlets, gentle lighting, and music that does not dominate the room. If you need video calls, choose a cafe with separate corners or a quieter upper floor. A work-friendly cafe does not need to be silent, but it should have a steady rhythm that lets you stay focused.",
      },
      {
        title: "Dates and conversations",
        body: "Look for comfortable spacing, warm light, an easy menu, and a location that works for both people. Cafes with small gardens, balconies, large windows, or greenery often create a softer mood. Avoid the busiest slots if you want the conversation to feel natural rather than rushed.",
      },
      {
        title: "Photos and design exploration",
        body: "A photogenic cafe usually has natural light, clear materials, a few signature corners, and enough room to move without disturbing other guests. Morning and early afternoon are often better for light. If the cafe is small, order first, keep your setup tidy, and be mindful of the people around you.",
      },
      {
        title: "Solo coffee",
        body: "Solo visits feel easier in cafes with single tables, bar seating, window views, or outdoor seats that still offer privacy. A calm playlist, friendly staff, and a clear coffee menu can make the place feel welcoming when all you want is a quiet drink, a few pages of reading, or a place to collect your thoughts.",
      },
    ],
    guideTitle: "How to scan a cafe before you go",
    guide: [
      "First, check whether the cafe is open and whether the remaining opening time fits your plan. A cafe closing in forty-five minutes might be fine for takeaway, but not for a long work session. Then read the location carefully. In Ho Chi Minh City, a short distance on the map can still take longer during rush hour, especially when you need to cross major roads or pass through construction-heavy areas.",
      "Next, look at the main vibe. Words like quiet, vintage, minimalist, outdoor, garden, specialty, rooftop, or work-friendly help set expectations. A vintage cafe can be beautiful but dim. A minimalist cafe can be clean and calm but short on privacy. A garden cafe can feel refreshing but may not be ideal during heavy rain. Do not choose only from the best photo; choose from the situation you actually need.",
      "Finally, think about who is joining you. A work session needs outlets and steady seating. A family visit needs space, simple ordering, and comfortable movement. A first meeting needs an easy address, a moderate noise level, and a flexible next step nearby. When these signals are clear, choosing a cafe becomes faster, less disappointing, and more memorable.",
    ],
    timingTitle: "Choose by time of day",
    timings: [
      {
        title: "Morning",
        body: "Early morning is ideal for cafes with natural light, a gentle pace, and steady service. If you want to work, choose a place that opens early, has window-side tables, and does not get harsh direct sun. If you only need breakfast and coffee, prioritize a clear menu, quick service, and a location close to your next route. Morning is also when many beautiful cafes are easier to photograph before the room fills up.",
      },
      {
        title: "Lunch and early afternoon",
        body: "Midday calls for a cool room, good air conditioning, comfortable seats, and a space that is not overwhelmed by the office lunch crowd. It is a practical time for reading, email, light meetings, or a short reset. If you are going with a group, choose a larger cafe because many places get quick office visits. A good midday cafe does not have to be dramatic; it simply needs to feel reliable and calm.",
      },
      {
        title: "Late afternoon",
        body: "Late afternoon is when many cafes shift from work mode to meet-up mode. The light can be beautiful but changes quickly, so arrive a little earlier if photos matter. If conversation is the goal, avoid tiny cafes or places that are currently trending heavily online. Cafes with balconies, small courtyards, or large windows often feel more relaxed during this part of the day.",
      },
      {
        title: "Evening",
        body: "Evening works best with warm lighting, non-caffeine options, light snacks, comfortable privacy, and a route that is easy for ride-hailing. If you are on a date or catching up with a friend, check closing time so the conversation is not interrupted too soon. Some central cafes look beautiful at night, but they can also be louder and busier, so match the place to the real purpose of the visit.",
      },
    ],
    detailTitle: "Small details that shape the whole visit",
    details: [
      {
        title: "Sound",
        body: "Music, grinders, conversation, and traffic all change how a cafe feels. A playlist can be excellent and still make the room unsuitable for work if the volume is too high. On the other hand, a quiet alley cafe can become a strong choice for reading or writing. When you need focus, look for notes about quiet space, laptop seating, upper floors, or corners with less foot traffic.",
      },
      {
        title: "Light",
        body: "Light affects both photos and comfort. Natural light is great for morning visits and photography. Warm light helps dates, conversations, and evening plans. Dim light can feel cozy but may strain your eyes if you read or work for long. Cafes with large windows, skylights, courtyards, or open facades often feel easier to stay in, but the direction of sunlight still matters by time of day.",
      },
      {
        title: "Seating",
        body: "A beautiful chair is not always comfortable for a long stay. For laptop work, pay attention to table height, seat firmness, spacing, and where the laptop can sit. For dates, a sofa or small table may feel warmer. For groups, long tables and wide walkways matter more than the prettiest background. The same cafe can be excellent for one purpose and awkward for another.",
      },
      {
        title: "Menu and service rhythm",
        body: "A useful menu has more than good coffee. It should also offer non-caffeine drinks, tea, fruit options, or light food for whoever joins you. Service rhythm matters too: a busy cafe that operates smoothly can still feel comfortable, while a beautiful cafe with long waits can break the schedule. Before making plans, choose a menu style that works for the whole group.",
      },
      {
        title: "Transport and parking",
        body: "In Ho Chi Minh City, parking and route choice can decide whether you want to return. A quiet alley cafe may feel calmer but be harder to find. A street-front cafe is easier to spot but may be noisier or harder for pickup. On weekends, allow extra time for parking, waiting, or moving to the next stop. A cafe on the right route often makes the day feel much lighter.",
      },
      {
        title: "Privacy",
        body: "Privacy does not always mean a closed room. Sometimes it is simply enough space between tables, a corner with less movement, or a background volume that softens conversation. For important conversations, choose a cafe with layered seating instead of one large open room. For solo work, a wall-side or window-side seat can feel more focused than a table in the center aisle.",
      },
    ],
    planningTitle: "A lighter way to plan coffee",
    planning: [
      "Before leaving, ask yourself three questions: how long do I want to stay, how quiet does the place need to be, and where am I going afterward? These questions remove many unsuitable options. If you only have one hour, choose somewhere close, easy to park at, and quick to order from. If you have the whole afternoon, you can choose a place a little farther away if the space is worth staying in.",
      "For workdays, keep a backup list by area. Have one main cafe for focus, one alternative if the first place is crowded, and one cafe near your final appointment of the day. This is especially useful in central neighborhoods where full tables and unexpected noise happen often. A backup plan saves energy because you do not need to start the decision process again.",
      "For weekends, choose by experience rather than distance alone. Some days are worth a longer ride for a garden cafe, a slow brunch, or a room with gentle music. Other days only need a reliable neighborhood cafe, a familiar drink, and a calm table. A good cafe map should make both kinds of days easier to plan.",
      "If you like discovering new places, remember why a cafe worked for you: light, coffee taste, service, seating, area, price, or the feeling when you walked in. After a few visits, you will see your own pattern. Some people prefer greenery, some prefer minimalist rooms, and some only need moderate sound and a stable table. Knowing that pattern makes each search faster while keeping the sense of discovery alive.",
    ],
    faqTitle: "Common questions when choosing a cafe",
    faqs: [
      {
        question: "How should I find cafes near me?",
        answer: "Start with your current area, then narrow the list by purpose: work, date, solo coffee, outdoor seating, quiet space, or photo-friendly design. In busy districts such as District 1, District 3, Binh Thanh, and Phu Nhuan, always check opening hours and likely peak times before traveling.",
      },
      {
        question: "Is every quiet cafe good for working?",
        answer: "Not always. Quietness matters, but laptop work also needs stable tables, decent chairs, wifi, outlets, light, and a seating policy that suits longer stays. A very quiet cafe with low tables and soft chairs may be better for reading than for a focused work session.",
      },
      {
        question: "What is the best time to visit beautiful cafes in Ho Chi Minh City?",
        answer: "Morning usually offers softer light and fewer crowds. Early afternoon is practical for work or reading. Evening is good for dates, but central cafes may be crowded, so expect more noise and less control over seating.",
      },
      {
        question: "How do I choose a cafe for a first date?",
        answer: "Pick somewhere easy to find, not too loud, warmly lit, comfortably spaced, and simple to order from. A place near restaurants, cinemas, or easy ride-hailing routes gives you flexibility if the conversation continues after coffee.",
      },
      {
        question: "Should I choose a cafe only from photos?",
        answer: "No. Photos show style, but the experience depends on timing, crowd level, sound, light, parking, and your reason for visiting. Combine images with vibe notes, area information, amenities, and practical details before deciding.",
      },
    ],
    closingTitle: "Cafe Maps makes cafe-hunting less random",
    closing: [
      "A city with so many cafes is exciting, but it can also make choosing slow. When each cafe is framed by area, style, purpose, and opening status, you can decide quickly while still keeping the pleasure of discovery. Cafe Maps brings those small signals together so you can find a morning coffee, a steady work corner, a warm place to meet a friend, or a new weekend stop without starting from scratch every time.",
      "Whether you prefer Vietnamese iced coffee, a neat espresso, cold brew, a hot latte, or a light fruit tea, the most important thing is the space around the drink. The right cafe can make work feel easier, conversation feel warmer, and an ordinary day feel like it has a place worth remembering.",
    ],
    exploreLabel: "Explore cafe listings",
    blogLabel: "Read more cafe tips",
  },
};

export default function HomeSeoContent({ locale }: HomeSeoContentProps) {
  const copy = content[normalizeLocale(locale)];

  return (
    <section className="bg-[#fffaf2] px-4 py-14 text-[#2c1a0e] sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(320px,0.42fr)] lg:gap-12">
          <article className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-[#a86113] uppercase">
              {copy.eyebrow}
            </p>
            <h2 className="font-lora text-3xl leading-tight font-bold text-[#160b05] sm:text-4xl">
              {copy.title}
            </h2>
            <div className="mt-5 space-y-4 text-[15px] leading-7 text-[#5c4129] sm:text-base sm:leading-8">
              {copy.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <h3 className="mt-10 text-xl font-bold text-[#160b05]">{copy.guideTitle}</h3>
            <div className="mt-4 space-y-4 text-[15px] leading-7 text-[#5c4129] sm:text-base sm:leading-8">
              {copy.guide.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <h3 className="mt-10 text-xl font-bold text-[#160b05]">{copy.timingTitle}</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {copy.timings.map((item) => (
                <section key={item.title} className="rounded-lg border border-[#ead8bd] bg-white/72 p-4">
                  <h4 className="font-semibold text-[#2c1a0e]">{item.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-[#6d5036]">{item.body}</p>
                </section>
              ))}
            </div>

            <h3 className="mt-10 text-xl font-bold text-[#160b05]">{copy.detailTitle}</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {copy.details.map((item) => (
                <section key={item.title} className="rounded-lg border border-[#ead8bd] bg-white/72 p-4">
                  <h4 className="font-semibold text-[#2c1a0e]">{item.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-[#6d5036]">{item.body}</p>
                </section>
              ))}
            </div>

            <h3 className="mt-10 text-xl font-bold text-[#160b05]">{copy.planningTitle}</h3>
            <div className="mt-4 space-y-4 text-[15px] leading-7 text-[#5c4129] sm:text-base sm:leading-8">
              {copy.planning.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <h3 className="mt-10 text-xl font-bold text-[#160b05]">{copy.closingTitle}</h3>
            <div className="mt-4 space-y-4 text-[15px] leading-7 text-[#5c4129] sm:text-base sm:leading-8">
              {copy.closing.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/search"
                className="inline-flex rounded-lg bg-[#2c1a0e] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5d3512]"
              >
                {copy.exploreLabel}
              </Link>
              <Link
                href="/blog"
                className="inline-flex rounded-lg border border-[#d8bd93] px-4 py-2.5 text-sm font-semibold text-[#5d3512] transition-colors hover:bg-[#f4eadb]"
              >
                {copy.blogLabel}
              </Link>
            </div>
          </article>

          <aside className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-[#160b05]">{copy.areaTitle}</h3>
              <div className="mt-4 grid gap-3">
                {copy.areas.map((item) => (
                  <section key={item.title} className="rounded-lg border border-[#ead8bd] bg-white/72 p-4">
                    <h4 className="font-semibold text-[#2c1a0e]">{item.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-[#6d5036]">{item.body}</p>
                  </section>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#160b05]">{copy.useCaseTitle}</h3>
              <div className="mt-4 grid gap-3">
                {copy.useCases.map((item) => (
                  <section key={item.title} className="rounded-lg border border-[#ead8bd] bg-white/72 p-4">
                    <h4 className="font-semibold text-[#2c1a0e]">{item.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-[#6d5036]">{item.body}</p>
                  </section>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-12 border-t border-[#ead8bd] pt-10">
          <h3 className="text-xl font-bold text-[#160b05]">{copy.faqTitle}</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {copy.faqs.map((item) => (
              <section key={item.question} className="rounded-lg border border-[#ead8bd] bg-white/72 p-5">
                <h4 className="font-semibold text-[#2c1a0e]">{item.question}</h4>
                <p className="mt-2 text-sm leading-6 text-[#6d5036]">{item.answer}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

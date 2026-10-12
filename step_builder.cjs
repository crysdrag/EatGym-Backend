const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://eatgym:change-me@localhost:5432/eatgym' });

function cleanTitle(raw) {
  if (!raw) return '';
  return raw.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\s]+/u, '').trim();
}

function buildDetailedSteps(dishTitle, ingredients, currentMin = 20) {
  const name = cleanTitle(dishTitle);
  const lower = name.toLowerCase();
  const ingList = (ingredients || []).filter(Boolean);
  const mainIng = ingList.length > 0 ? ingList.slice(0, 3).join(', ') : name;
  let totalTime = Math.max(parseInt(currentMin) || 20, 15);

  let steps = [];

  // 1. CHÁO CÁC LOẠI
  if (lower.includes('cháo')) {
    let s1 = 4, s2 = 8, s3 = 10, s4 = 3, s5 = 2;
    if (lower.includes('sườn')) {
      steps = [
        `Bước 1: Sơ chế sườn và gạo (${s1} phút) - Sườn non rửa sạch với nước muối loãng, chặt khúc vừa ăn. Chần sơ sườn trong nước sôi có gừng đập dập 3 phút để khử sạch bọt bẩn và mùi tanh. Gạo tẻ vo sạch rồi ngâm nước ấm giúp hạt gạo nhanh nở mềm.`,
        `Bước 2: Hầm sườn lấy nước ngọt thanh (${s2} phút) - Cho sườn vào nồi với 1.2 lít nước lạnh, thêm 1 củ hành tím nướng và 1 thìa cà phê muối hồng. Đun sôi bùng rồi hạ lửa nhỏ ninh trong ${s2} phút, thường xuyên hớt bọt để nước dùng trong vắt và ngọt đậm đà.`,
        `Bước 3: Nấu cháo sánh mịn (${s3} phút) - Trút gạo đã ráo vào nồi nước hầm sườn. Khuấy đều tay theo chiều kim đồng hồ để gạo không bị lắng dính đáy nồi. Ninh nhỏ lửa trong ${s3} phút cho hạt gạo nở bung, sánh quyện cùng vị ngọt của tủy sườn.`,
        `Bước 4: Nêm nếm gia vị vừa miệng (${s4} phút) - Nêm 1 thìa nước mắm ngon, hạt nêm từ nấm và chút xíu tiêu xay. Nếm lại cho vừa khẩu vị thanh đạm, đảo đều 2 phút cho gia vị hòa quyện sâu vào từng hạt cháo.`,
        `Bước 5: Hoàn thiện & Thưởng thức (${s5} phút) - Múc cháo sườn nóng hổi ra tô, rắc hành hoa, ngò rí cắt nhỏ, thêm chút tiêu đen thơm nức. Ăn ngay khi còn nóng ấm để bổ sung năng lượng và phục hồi thể lực sau tập luyện.`
      ];
    } else if (lower.includes('yến mạch')) {
      steps = [
        `Bước 1: Sơ chế nguyên liệu tươi (${s1} phút) - Rửa sạch các nguyên liệu (${mainIng}). Ức gà hoặc thịt nạc thái lát mỏng, nấm rửa sạch cắt chân thái hạt lựu.`,
        `Bước 2: Nấu nước dùng đạm dinh dưỡng (${s2} phút) - Đặt nồi nước lên bếp, cho thịt vào nấu sôi nhẹ trong ${s2} phút để thịt chín tới và tạo độ ngọt tự nhiên cho nước dùng.`,
        `Bước 3: Nấu yến mạch sánh dẻo (${s3} phút) - Cho yến mạch cán dẹt vào nồi nước dùng đang sôi lăn tăn, khuấy đều tay liên tục trong ${s3} phút để yến mạch nở dẻo thơm ngậy, không bị khê đáy.`,
        `Bước 4: Nêm nếm thanh nhẹ (${s4} phút) - Thêm nấm hương và nêm chút muối hồng, xíu nước tương nhẹ vị. Đun sôi lăn tăn thêm ${s4} phút để nấm chín thơm và hòa quyện cùng yến mạch.`,
        `Bước 5: Hoàn thiện tô cháo yến mạch (${s5} phút) - Múc cháo ra tô, rắc thêm tiêu xay, hành lá thái nhỏ và vài giọt dầu mè thơm. Thưởng thức nóng cho bữa sáng hoặc bữa sau tập hoàn hảo.`
      ];
    } else {
      steps = [
        `Bước 1: Sơ chế nguyên liệu chính (${s1} phút) - Rửa sạch ${mainIng}. Thịt/nội tạng hoặc các loại hạt ngâm rửa kỹ với muối và gừng khử mùi. Gạo vo sạch để ráo.`,
        `Bước 2: Nấu nước hầm thanh ngọt (${s2} phút) - Đặt nồi nước lên bếp đun sôi cùng vài lát gừng, cho nguyên liệu đạm vào luộc/hầm nhỏ lửa trong ${s2} phút, hớt sạch bọt cho nước trong.`,
        `Bước 3: Ninh cháo nhừ mềm (${s3} phút) - Cho gạo vào nồi nước hầm, đun sôi rồi hạ lửa riu riu trong ${s3} phút. Thỉnh thoảng khuấy đều để cháo đạt độ sánh mịn tự nhiên.`,
        `Bước 4: Nêm gia vị hài hòa (${s4} phút) - Cho phần nhân đạm đã thái miếng vừa ăn vào nồi cháo, nêm nước mắm cốt, muối tiêu vừa miệng và đun sôi nhẹ trong ${s4} phút cho ngấm gia vị.`,
        `Bước 5: Bày tô và thưởng thức (${s5} phút) - Múc cháo nóng ra tô, rắc hành lá, tía tô hoặc tiêu bắc xay mịn. Dùng ngay khi còn bốc khói để cảm nhận trọn vẹn vị ngon ngọt bổ dưỡng.`
      ];
    }
  }

  // 2. ĐẬU HŨ / DỒN THỊT / NHỒI
  else if (lower.includes('đậu hủ') || lower.includes('đậu phụ') || lower.includes('dồn thịt') || lower.includes('nhồi')) {
    if (lower.includes('dồn thịt') || lower.includes('nhồi thịt')) {
      steps = [
        `Bước 1: Sơ chế nguyên liệu tươi (5 phút) - Đậu hũ rửa nhẹ qua nước ấm, dùng khăn giấy thấm khô rồi rạch một đường giữa bụng hoặc khoét nhẹ ruột đậu. Thịt nạc vai rửa sạch, băm nhuyễn cùng mộc nhĩ ngâm nở và hành khô.`,
        `Bước 2: Trộn ướp và nhồi nhân (5 phút) - Trộn đều thịt băm với 1 thìa nước mắm ngon, tiêu đen xay và hành tím băm nhỏ. Để 3 phút cho ngấm gia vị, sau đó dùng thìa khéo léo nhồi phần nhân thịt vào từng miếng đậu hũ cho đầy đặn, vuốt phẳng mặt thịt.`,
        `Bước 3: Áp chảo săn vàng mặt thịt (6 phút) - Làm nóng chảo chống dính với 1 thìa cà phê dầu ô liu. Đặt mặt có thịt của đậu hũ xuống áp chảo lửa vừa trong 6 phút cho mặt thịt xém vàng thơm nức và định hình chắc chắn.`,
        `Bước 4: Om sốt cà chua ngấm đượm (6 phút) - Phi thơm hành khô, cho cà chua thái hạt lựu vào xào nhuyễn cùng chút nước lọc và nước tương. Xếp từng miếng đậu hũ vào, đậy nắp om nhỏ lửa trong 6 phút cho nước sốt sánh lại và thấm đẫm vào từng miếng đậu.`,
        `Bước 5: Trình bày và thưởng thức (2 phút) - Nếm lại nước sốt cho vừa miệng, rắc hành lá cắt khúc và tiêu xay lên trên. Gắp đậu hũ ra đĩa sâu lòng, rưới nước sốt lên mặt và thưởng thức cùng cơm gạo lứt hoặc rau củ.`
      ];
    } else if (lower.includes('sốt cà')) {
      steps = [
        `Bước 1: Sơ chế đậu và cà chua (4 phút) - Đậu hũ cắt miếng vuông quân cờ vừa ăn. Cà chua rửa sạch, bỏ hạt rồi băm nhỏ hoặc thái hạt lựu. Hành tím và tỏi bóc vỏ băm nhuyễn.`,
        `Bước 2: Áp chảo vàng các mặt đậu (6 phút) - Làm nóng chảo với 1 thìa dầu ô liu, nhẹ nhàng xếp các miếng đậu vào áp chảo lửa vừa trong 6 phút, lật đều các mặt cho đậu vàng giòn lớp vỏ ngoài mà bên trong vẫn mềm béo.`,
        `Bước 3: Xào sốt cà chua sệt mịn (5 phút) - Trút đậu ra đĩa. Dùng lại chảo, phi thơm hành tỏi băm rồi cho cà chua vào đảo đều trên lửa vừa trong 5 phút đến khi cà chua mềm nhuyễn thành sốt đỏ tươi sánh mịn.`,
        `Bước 4: Om đậu cùng sốt cà chua (4 phút) - Cho đậu hũ đã áp chảo vào chảo sốt cà chua, thêm 2 thìa nước tương và chút xíu muối tiêu. Đậy nắp đun nhỏ lửa trong 4 phút để đậu ngấm trọn vị chua ngọt tự nhiên của cà chua.`,
        `Bước 5: Hoàn thiện món ăn (2 phút) - Rắc hành lá, mùi tàu thái nhỏ và chút tiêu đen xay lên mặt chảo. Tắt bếp, gắp đậu ra đĩa và thưởng thức khi còn nóng hổi.`
      ];
    } else if (lower.includes('chiên') || lower.includes('xả') || lower.includes('sả')) {
      steps = [
        `Bước 1: Sơ chế đậu và sả ớt (5 phút) - Đậu hũ rửa sạch, cắt miếng vuông hoặc chữ nhật vừa ăn, thấm thật khô ráo nước. Sả tươi bóc vỏ già, băm thật nhuyễn cùng tỏi và ớt hiểm.`,
        `Bước 2: Ướp đậu với sả thơm (4 phút) - Trộn sả ớt băm cùng chút muối hồng, xíu bột nghệ cho màu vàng đẹp. Ướp đều lên các mặt của miếng đậu hũ trong 4 phút cho ngấm hương thơm thảo mộc.`,
        `Bước 3: Chiên áp chảo giòn vỏ (6 phút) - Cho 1 thìa dầu ô liu vào chảo chống dính đun nóng. Nhẹ nhàng đặt các miếng đậu vào chiên trên lửa vừa trong 6 phút, lật đều hai mặt cho đến khi lớp vỏ ngoài vàng ruộm giòn tan.`,
        `Bước 4: Rang sả giòn thơm (3 phút) - Gạt đậu sang một góc chảo, cho phần sả ớt băm còn lại vào đảo nhanh tay trong 3 phút trên lửa lớn cho sả vàng ruộm, giòn rụm và dậy mùi thơm nức mũi.`,
        `Bước 5: Trình bày và thưởng thức (2 phút) - Đổ sả rang giòn phủ đều lên mặt các miếng đậu hũ, gắp ra đĩa có lót giấy thấm dầu và thưởng thức ngay khi còn nóng giòn rụm.`
      ];
    } else {
      steps = [
        `Bước 1: Sơ chế nguyên liệu tươi (4 phút) - Đậu hũ rửa nhẹ, cắt miếng vừa ăn. Chuẩn bị các nguyên liệu đi kèm (${mainIng}), rửa sạch và cắt tỉa gọn gàng.`,
        `Bước 2: Tẩm ướp gia vị thanh đạm (3 phút) - Ướp đậu hũ nhẹ nhàng với chút muối tiêu, hành tỏi băm để đậu đượm vị mà không làm vỡ miếng đậu.`,
        `Bước 3: Chế biến nhiệt chính (6 phút) - Đặt chảo lên bếp với chút dầu ô liu, áp chảo hoặc xào nhanh các nguyên liệu trong 6 phút ở lửa vừa cho bề mặt vàng đều và dậy mùi thơm.`,
        `Bước 4: Nêm nếm nước sốt hòa quyện (4 phút) - Rưới nước sốt tương gừng hoặc nước sốt nấm thanh đạm vào chảo, đun nhỏ lửa trong 4 phút cho ngấm sâu vào từng thớ đậu.`,
        `Bước 5: Hoàn thiện & Thưởng thức (2 phút) - Rắc hành ngò thái nhỏ và tiêu thơm, gắp ra đĩa và dùng ngay khi còn nóng ấm cùng cơm hoặc rau xanh.`
      ];
    }
  }

  // 3. CANH / SOUP / SÚP
  else if (lower.includes('canh') || lower.includes('soup') || lower.includes('súp')) {
    let s1 = 4, s2 = 5, s3 = 6, s4 = 3, s5 = 2;
    if (lower.includes('chua')) {
      steps = [
        `Bước 1: Sơ chế cá/tôm và rau củ chua (5 phút) - Cá/tôm làm sạch, khử tanh bằng rượu trắng và muối rồi cắt khúc để ráo. Thơm (dứa) gọt vỏ cắt lát, cà chua bổ múi cau, đậu bắp cắt xéo, dọc mùng tước vỏ bóp muối, giá đỗ rửa sạch.`,
        `Bước 2: Nấu nước cốt me thanh mát (4 phút) - Dầm me chua với nửa bát nước ấm để lấy nước cốt me. Đặt nồi lên bếp, phi thơm tỏi băm với chút dầu ô liu rồi đổ 800ml nước lọc và nước cốt me vào đun sôi bùng.`,
        `Bước 3: Nấu chín nguyên liệu đạm (5 phút) - Khi nước sôi mạnh, nhẹ nhàng thả cá/tôm vào đun ở lửa vừa trong 5 phút cho cá chín tới, thịt trắng ngọt và nước canh trong, hớt sạch bọt trên mặt.`,
        `Bước 4: Cho rau củ và nêm gia vị chuẩn vị chua ngọt (4 phút) - Cho thơm, cà chua, đậu bắp, dọc mùng vào nồi đun sôi thêm 3 phút cho rau củ vừa chín giòn. Nêm nước mắm ngon, chút đường phèn hoặc mật ong, muối hồng vừa miệng rồi thả giá đỗ vào.`,
        `Bước 5: Hoàn thiện bát canh chua thơm lừng (2 phút) - Tắt bếp, rắc rau ngò ôm, ngò gai thái nhỏ và vài lát ớt hiểm đỏ tươi. Múc canh ra tô lớn và thưởng thức khi còn nóng hổi.`
      ];
    } else if (lower.includes('khổ qua')) {
      steps = [
        `Bước 1: Sơ chế khổ qua và nhân thịt (5 phút) - Khổ qua rửa sạch, cắt khúc 4cm rồi dùng thìa nạo sạch ruột trắng để giảm vị đắng. Thịt nạc vai băm nhuyễn trộn cùng mộc nhĩ thái sợi, hành tím băm và tiêu xay.`,
        `Bước 2: Nhồi nhân thịt vào trái khổ qua (4 phút) - Nhồi phần thịt băm thật chặt vào từng khúc khổ qua, vuốt phẳng hai đầu. Có thể chần qua cọng hành lá để buộc ngang cho đẹp mắt.`,
        `Bước 3: Nấu nước dùng thanh ngọt (4 phút) - Đặt nồi nước lên bếp đun sôi cùng vài củ hành tím đập dập và xíu muối. Nước sôi bùng thì vớt sạch bọt để nước canh được trong veo.`,
        `Bước 4: Hầm khổ qua chín mềm ngọt (6 phút) - Nhẹ nhàng thả từng khúc khổ qua dồn thịt vào nồi, hạ lửa vừa hầm trong 6 phút cho khổ qua mềm ngả màu xanh lục bảo và thịt bên trong chín ngọt.`,
        `Bước 5: Nêm nếm và thưởng thức (2 phút) - Nêm chút nước mắm ngon và hạt nêm thanh đạm. Múc khổ qua ra tô, rắc hành ngò thái nhỏ và tiêu cay nồng, ăn nóng giúp thanh nhiệt giải độc cơ thể.`
      ];
    } else {
      steps = [
        `Bước 1: Sơ chế rau củ và thịt đạm (${s1} phút) - Rửa sạch ${mainIng}. Rau củ gọt vỏ, thái miếng vừa ăn. Thịt/tôm băm nhỏ hoặc thái lát mỏng, ướp chút hành tím và tiêu xay.`,
        `Bước 2: Xào săn đạm tạo vị ngọt tự nhiên (${s2} phút) - Làm nóng nồi với 1 thìa dầu ô liu, phi thơm hành tím rồi cho thịt/tôm vào đảo săn trong 2 phút. Sau đó chế 750ml nước lọc đun sôi bùng.`,
        `Bước 3: Nấu chín rau củ thanh mát (${s3} phút) - Khi nước sôi, thả rau củ vào nồi đun lửa vừa trong ${s3} phút cho rau củ chín mềm ngọt tự nhiên mà vẫn giữ màu sắc tươi tắn và hàm lượng vitamin.`,
        `Bước 4: Nêm nếm gia vị Eat Clean (${s4} phút) - Nêm chút muối hồng, hạt nêm nấm và thìa nước mắm ngon. Nếm thử để canh có vị ngọt thanh dịu nhẹ, hớt bọt cho nước thật trong.`,
        `Bước 5: Bày tô canh nóng hổi (${s5} phút) - Tắt bếp, rắc hành hoa, ngò rí và tiêu xay. Múc ra tô lớn dùng nóng cùng bữa cơm giúp cấp nước và chất xơ tuyệt vời cho gymer.`
      ];
    }
  }

  // 4. BÚN / PHỞ / MÌ / MIẾN / HỦ TIẾU
  else if (lower.includes('bún') || lower.includes('phở') || lower.includes('mì') || lower.includes('miến') || lower.includes('hủ tiếu') || lower.includes('bánh canh')) {
    let s1 = 4, s2 = 8, s3 = 3, s4 = 3, s5 = 2;
    if (lower.includes('bò')) {
      steps = [
        `Bước 1: Sơ chế thịt bò và rau thơm (${s1} phút) - Thịt bò tươi rửa sạch, dùng khăn thấm khô rồi thái lát mỏng ngang thớ. Rau thơm, húng quế, giá đỗ, hành lá, ngò gai nhặt rửa sạch, ngâm nước muối loãng rồi vẩy ráo.`,
        `Bước 2: Nấu nước dùng thơm thảo mộc (${s2} phút) - Nướng thơm gừng và hành tây, đập dập quế hồi thảo quả cho vào túi lọc thả vào nồi nước dùng xương ninh nhỏ lửa trong ${s2} phút. Nêm gia vị muối hồng, xíu nước mắm ngon cho nước dùng đậm đà thanh ngọt.`,
        `Bước 3: Trụng bánh phở/sợi bún (${s3} phút) - Đun sôi một nồi nước riêng, cho bánh phở/bún vào trụng nhanh trong ${s3} phút cho sợi bún mềm nóng dai ngon, vớt ra xóc ráo nước rồi chia đều vào tô.`,
        `Bước 4: Trần thịt bò tái lăn/chín mềm (${s4} phút) - Xếp thịt bò lên mặt bánh phở, rải hành tây thái mỏng, đầu hành chẻ và hành hoa. Chan nước dùng đang sôi sùng sục ngập mặt thịt để thịt bò chín tái mọng nước mềm tan.`,
        `Bước 5: Thưởng thức bát phở bò nóng hổi (${s5} phút) - Vắt thêm lát chanh tươi, thêm vài lát ớt sừng cay nồng và ăn kèm đĩa rau thơm tươi giòn. Dùng ngay khi còn nóng hổi chuẩn vị.`
      ];
    } else if (lower.includes('gà')) {
      steps = [
        `Bước 1: Sơ chế thịt gà và rau ghém (${s1} phút) - Thịt gà (ức gà hoặc đùi gà bỏ da) xát muối và gừng rửa sạch. Rau mùi, hành lá, giá đỗ rửa sạch để ráo. Lá chanh bánh tẻ rửa sạch thái chỉ mỏng.`,
        `Bước 2: Luộc gà lấy nước dùng ngọt thanh (${s2} phút) - Cho gà vào nồi cùng gừng đập dập, hành tím nướng và 1 lít nước. Luộc ở lửa vừa trong ${s2} phút cho gà vừa chín tới, giữ được độ ngọt mọng. Vớt gà ra ngâm nước đá rồi xé sợi hoặc thái miếng.`,
        `Bước 3: Trụng sợi bún/phở dai ngon (${s3} phút) - Đun sôi nồi nước, trụng bún/phở trong ${s3} phút cho tơi mềm, vớt ra để ráo rồi xếp vào lòng tô sâu.`,
        `Bước 4: Xếp gà và chan nước dùng (${s4} phút) - Xếp thịt gà xé, hành hoa, rau mùi và lá chanh thái chỉ lên trên bún. Đun nước dùng sôi sùng sục, nêm nếm lại rồi chan ngập đều bát bún.`,
        `Bước 5: Thưởng thức chuẩn vị thanh tao (${s5} phút) - Thêm chút tiêu bắc xay, vắt chanh tươi và ăn kèm đĩa giá trụng hoặc rau thơm. Món ăn giàu đạm tinh khiết, ít chất béo lý tưởng cho gymer.`
      ];
    } else {
      steps = [
        `Bước 1: Sơ chế đạm và rau ghém (${s1} phút) - Làm sạch các nguyên liệu (${mainIng}). Thịt/hải sản sơ chế khử tanh thái miếng vừa ăn. Rau thơm, hành ngò rửa sạch để ráo nước.`,
        `Bước 2: Nấu nước súp thanh ngọt tự nhiên (${s2} phút) - Đun sôi nồi nước dùng với củ hành tím và gừng nướng trong ${s2} phút. Nêm gia vị muối tiêu, nước mắm ngon vừa khẩu vị thanh đạm.`,
        `Bước 3: Trụng sợi bún/mì dai giòn (${s3} phút) - Đun sôi nồi nước riêng, trụng sợi mì/bún trong ${s3} phút cho mềm dai, vớt ra ráo nước rồi cho vào từng tô.`,
        `Bước 4: Xếp nhân và chan nước súp (${s4} phút) - Xếp phần thịt/hải sản đã làm chín, rải hành ngò thái nhỏ lên mặt tô. Chan nước súp sôi bốc khói ngập đều sợi bún trong ${s4} phút.`,
        `Bước 5: Bày biện và thưởng thức (${s5} phút) - Thêm tiêu xay, vắt chanh tươi và dùng kèm đĩa rau sống tươi non. Thưởng thức ngay khi còn bốc khói nghi ngút.`
      ];
    }
  }

  // 5. CƠM / XÔI / CƠM TẤM / CƠM CHIÊN
  else if (lower.includes('cơm') || lower.includes('xôi')) {
    if (lower.includes('tấm') || lower.includes('sườn')) {
      steps = [
        `Bước 1: Sơ chế và ướp sườn cốt lết (5 phút) - Sườn cốt lết rửa sạch nước muối, dùng sống dao dần nhẹ cho mềm thớ thịt. Ướp sườn với tỏi ớt băm, sả băm, 1 thìa mật ong, nước mắm, dầu hào và xíu dầu ô liu trong 5 phút cho ngấm đượm hương vị.`,
        `Bước 2: Nấu cơm tấm dẻo thơm (4 phút) - Gạo tấm vo sạch, cho lượng nước vừa đủ vào nồi nấu chín tơi xốp, giữ ấm trong nồi.`,
        `Bước 3: Nướng/Áp chảo sườn vàng óng (6 phút) - Làm nóng chảo nướng hoặc chảo chống dính, cho sườn vào áp chảo lửa vừa trong 6 phút, lật đều hai mặt và quét nước sốt ướp lên cho miếng sườn lên màu cánh gián vàng óng, thơm nức mũi.`,
        `Bước 4: Làm mỡ hành và đồ chua (3 phút) - Hành lá thái nhỏ, cho vào chén với xíu muối rồi rót 1 thìa dầu ô liu đun nóng vào để làm mỡ hành xanh mướt. Chuẩn bị dưa leo, cà chua và cà rốt ngâm chua ngọt.`,
        `Bước 5: Bày đĩa cơm tấm hoàn chỉnh (2 phút) - Xới cơm tấm ra đĩa, đặt miếng sườn nướng thơm phức lên trên, rưới mỡ hành bóng bẩy, xếp đồ chua và dưa leo xung quanh. Dọn kèm chén nước mắm chua ngọt thanh nhẹ và thưởng thức.`
      ];
    } else if (lower.includes('chiên') || lower.includes('rang')) {
      steps = [
        `Bước 1: Sơ chế nguyên liệu rau củ và thịt (4 phút) - Cà rốt, đậu cô ve, bắp ngọt và thịt/tôm (${mainIng}) thái hạt lựu đều nhau. Cơm để nguội đánh tơi hạt.`,
        `Bước 2: Tẩm ướp và xào sơ nhân thịt (4 phút) - Ướp thịt với xíu tiêu và tỏi băm. Cho 1 thìa dầu ô liu vào chảo phi thơm hành, trút thịt và rau củ vào xào chín tới trong 4 phút rồi múc ra đĩa.`,
        `Bước 3: Đảo cơm săn hạt vàng óng (5 phút) - Cho cơm vào chảo đảo đều tay trên lửa lớn trong 5 phút. Đánh tan 1 quả trứng gà rưới đều vào cơm, đảo nhanh tay để trứng bọc đều từng hạt cơm vàng óng và tơi xốp.`,
        `Bước 4: Hòa quyện cơm và nhân đạm (4 phút) - Trút đĩa thịt và rau củ vào chảo cơm, nêm 1 thìa dầu hào thanh vị và chút xíu nước tương. Đảo đều tay trên lửa vừa trong 4 phút cho ngấm đều vị thơm ngon.`,
        `Bước 5: Hoàn thiện đĩa cơm chiên (2 phút) - Rắc hành lá thái nhỏ và tiêu xay thơm lừng. Trút cơm ra đĩa, ăn kèm vài lát dưa leo tươi giòn và thưởng thức nóng.`
      ];
    } else {
      steps = [
        `Bước 1: Sơ chế nguyên liệu ăn kèm (4 phút) - Rửa sạch các nguyên liệu (${mainIng}). Thái lát hoặc băm nhỏ thịt và rau củ. Chuẩn bị phần cơm nấu chín thơm dẻo.`,
        `Bước 2: Ướp đạm gia vị thảo mộc (4 phút) - Ướp thịt với tỏi hành băm, tiêu đen và thìa nước mắm ngon trong 4 phút cho ngấm gia vị.`,
        `Bước 3: Chế biến món mặn ăn kèm (6 phút) - Làm nóng chảo với chút dầu ô liu, cho thịt và rau củ vào xào/áp chảo trong 6 phút đến khi chín tới, thơm phức.`,
        `Bước 4: Cân đối khẩu phần macro (3 phút) - Định lượng chuẩn 1 chén cơm gạo lứt/gạo trắng (carbs tốt), xếp thịt chín vàng (protein) và rau củ luộc/xào (chất xơ) cân đối.`,
        `Bước 5: Thưởng thức bữa cơm lành mạnh (2 phút) - Rắc mè rang hoặc hành hoa lên trên, ăn ngay khi cơm và thức ăn còn nóng ấm để nạp trọn vẹn dưỡng chất.`
      ];
    }
  }

  // 6. XÀO CÁC LOẠI
  else if (lower.includes('xào')) {
    let s1 = 4, s2 = 4, s3 = 4, s4 = 4, s5 = 2;
    steps = [
      `Bước 1: Sơ chế và thái lát (${s1} phút) - Rửa sạch ${mainIng}. Thịt thái lát mỏng ngang thớ để khi xào mềm ngọt không bị dai. Rau củ cắt khúc hoặc thái lát vừa ăn để chín đều.`,
      `Bước 2: Tẩm ướp thịt & Chuẩn bị sốt xào (${s2} phút) - Ướp thịt với 1 thìa tỏi băm, tiêu xay, xíu dầu hào và 1 thìa cà phê dầu ô liu trong ${s2} phút. Pha sẵn chén sốt xào nhẹ vị với chút nước tương và nước lọc.`,
      `Bước 3: Xào săn phần đạm lửa lớn (${s3} phút) - Đun nóng chảo chống dính với 1 thìa dầu ô liu, phi thơm tỏi rồi trút thịt vào đảo thật nhanh tay trên lửa lớn trong ${s3} phút đến khi thịt vừa chín tới thì trút riêng ra đĩa để giữ trọn độ mọng nước.`,
      `Bước 4: Xào rau củ & Hòa quyện (${s4} phút) - Dùng lại chảo, cho rau củ vào xào nhanh trên lửa lớn trong 2 phút cho giòn ngọt, sau đó trút thịt đã xào vào cùng sốt xào, đảo đều tay trong 2 phút cho tất cả ngấm đều vị.`,
      `Bước 5: Hoàn thiện món xào giòn ngọt (${s5} phút) - Rắc hành hoa cắt khúc, tiêu xay thơm nức mũi. Tắt bếp, trút ngay ra đĩa và thưởng thức khi còn nóng giòn.`
    ];
  }

  // 7. ÁP CHẢO / BÍT TẾT / STEAK / CHIÊN
  else if (lower.includes('áp chảo') || lower.includes('bít tết') || lower.includes('steak') || lower.includes('chiên')) {
    let s1 = 3, s2 = 5, s3 = 5, s4 = 3, s5 = 2;
    steps = [
      `Bước 1: Sơ chế và thấm khô (${s1} phút) - Rửa sạch ${mainIng} với nước muối loãng, dùng khăn giấy nhà bếp thấm thật khô ráo bề mặt để khi áp chảo miếng thịt đạt độ vàng xém đẹp mắt và giữ trọn nước thịt.`,
      `Bước 2: Tẩm ướp gia vị thảo mộc (${s2} phút) - Rắc đều muối hồng, tiêu đen xay thô, tỏi băm và lá thảo mộc (hương thảo/thyme) lên hai mặt. Để ngấm đều gia vị trong ${s2} phút.`,
      `Bước 3: Áp chảo khóa ẩm lửa lớn (${s3} phút) - Làm nóng chảo gang với 1 thìa dầu ô liu ở nhiệt độ cao. Đặt miếng thịt vào áp chảo lửa vừa trong ${s3} phút (khoảng 2.5 phút mỗi mặt) để khóa trọn dòng nước ngọt bên trong.`,
      `Bước 4: Rưới bơ tỏi thơm lừng (${s4} phút) - Thả tép tỏi đập dập và nhánh thảo mộc vào chảo, nghiêng chảo múc dầu thơm rưới liên tục lên miếng thịt trong ${s4} phút cho bề mặt mướt bóng dậy mùi thơm quyến rũ.`,
      `Bước 5: Để thịt nghỉ & Thưởng thức (${s5} phút) - Gắp thịt ra thớt để nghỉ ${s5} phút giúp thớ thịt giữ trọn độ mọng nước tự nhiên, cắt lát xéo vừa ăn và thưởng thức cùng salad tươi hoặc khoai lang nướng.`
    ];
  }

  // 8. HẤP / LUỘC
  else if (lower.includes('hấp') || lower.includes('luộc')) {
    let s1 = 4, s2 = 3, s3 = 2, s4 = 8, s5 = 2;
    steps = [
      `Bước 1: Sơ chế và làm sạch (${s1} phút) - Rửa sạch ${mainIng} dưới vòi nước chảy. Khía nhẹ vài đường trên thân nguyên liệu để hơi nóng và hương thơm ngấm sâu vào bên trong.`,
      `Bước 2: Ướp gừng sả thơm mát (${s2} phút) - Sả đập dập cắt khúc, gừng cạo vỏ thái sợi chỉ, hành lá rửa sạch. Ướp nhẹ cùng chút muối hồng và tiêu xay lên nguyên liệu trong ${s2} phút.`,
      `Bước 3: Đun sôi xửng hấp (${s3} phút) - Cho nước sạch vào đáy nồi hấp cùng vài lát gừng, đậy nắp đun sôi bốc hơi nghi ngút để chuẩn bị nhiệt độ tối ưu.`,
      `Bước 4: Hấp chín giữ trọn dinh dưỡng (${s4} phút) - Xếp nguyên liệu vào xửng hấp, rải gừng sả lên trên, đậy kín nắp hấp cách thủy trong ${s4} phút ở lửa vừa đến khi chín mềm ngọt thịt mà không thất thoát vi chất.`,
      `Bước 5: Thưởng thức cùng sốt chấm (${s5} phút) - Pha chén nước chấm gừng tỏi ớt ít muối hoặc muối tiêu chanh tươi. Gắp món hấp nóng bốc khói ra đĩa và thưởng thức ngay.`
    ];
  }

  // 9. KHO / RIM / OM / SỐT
  else if (lower.includes('kho') || lower.includes('rim') || lower.includes('om') || lower.includes('sốt')) {
    let s1 = 4, s2 = 5, s3 = 4, s4 = 6, s5 = 2;
    steps = [
      `Bước 1: Sơ chế nguyên liệu tươi (${s1} phút) - Rửa sạch ${mainIng}, cắt khúc hoặc thái miếng vuông vừa ăn. Khử tanh bằng rượu trắng hoặc nước gừng, để ráo nước.`,
      `Bước 2: Ướp gia vị đậm đà (${s2} phút) - Ướp nguyên liệu với nước mắm ngon, tiêu xay, hành tỏi băm nhỏ và xíu mật ong/nước màu tự nhiên trong ${s2} phút cho thấm sâu vào từng thớ thịt.`,
      `Bước 3: Xào săn nguyên liệu (${s3} phút) - Cho chút dầu ô liu vào nồi đất hoặc chảo dày, phi thơm tỏi hành rồi trút nguyên liệu vào đảo đều trong ${s3} phút cho săn chắc và lên màu cánh gián đẹp mắt.`,
      `Bước 4: Kho/Om nhỏ lửa (${s4} phút) - Chế thêm nửa chén nước ấm hoặc nước dừa tươi, đun sôi rồi hạ nhỏ lửa đậy nắp om liu riu trong ${s4} phút đến khi nước sốt sánh lại, đậm vị ngọt bùi.`,
      `Bước 5: Hoàn thiện món kho thơm lừng (${s5} phút) - Mở nắp, thêm ớt hiểm và hành hoa cắt khúc, đảo nhẹ 1 phút rồi tắt bếp. Múc ra đĩa dùng cùng cơm nóng hoặc rau luộc.`
    ];
  }

  // 10. SALAD / GỎI / TRỘN / NỘM
  else if (lower.includes('salad') || lower.includes('gỏi') || lower.includes('trộn') || lower.includes('nộm')) {
    let s1 = 5, s2 = 5, s3 = 3, s4 = 2, s5 = 2;
    steps = [
      `Bước 1: Sơ chế rau củ tươi sạch (${s1} phút) - Rửa sạch các loại rau sống, xà lách, cà chua bi, dưa leo (${mainIng}) với nước muối loãng, để ráo nước rồi cắt miếng vừa ăn. Giữ lạnh để giữ độ giòn tươi.`,
      `Bước 2: Chế biến phần đạm topping (${s2} phút) - Luộc hoặc áp chảo chín tới phần ức gà/trứng/tôm/đậu hũ với chút muối tiêu trong ${s2} phút, sau đó xé sợi hoặc thái lát mỏng đẹp mắt.`,
      `Bước 3: Pha sốt trộn Eat-Clean (${s3} phút) - Khuấy đều 1 thìa dầu ô liu nguyên chất, nước cốt chanh tươi/giấm táo, xíu mật ong, tiêu đen xay và tỏi ớt băm nhuyễn tạo thành sốt sánh mịn chua ngọt thanh tao.`,
      `Bước 4: Trộn đều nguyên liệu (${s4} phút) - Cho toàn bộ rau củ và topping đạm vào âu lớn, rưới đều nước sốt rồi dùng tay nhẹ nhàng đảo từ dưới lên để rau thấm đều vị mà không bị dập nát.`,
      `Bước 5: Rắc hạt dinh dưỡng & Thưởng thức (${s5} phút) - Bày salad ra đĩa sâu lòng, rắc thêm mè rang hoặc hạt hạnh nhân đập dập lên trên để tăng độ bùi béo tốt cho tim mạch, thưởng thức ngay.`
    ];
  }

  // 11. BÁNH / WRAP / SANDWICH
  else if (lower.includes('bánh') || lower.includes('wrap') || lower.includes('sandwich')) {
    let s1 = 3, s2 = 4, s3 = 4, s4 = 3, s5 = 2;
    steps = [
      `Bước 1: Sơ chế rau tươi và nhân bánh (${s1} phút) - Rửa sạch xà lách, cà chua, dưa chuột thái lát mỏng. Chuẩn bị phần vỏ bánh và nguyên liệu chính (${mainIng}).`,
      `Bước 2: Chế biến phần nhân đạm (${s2} phút) - Áp chảo thịt/trứng/cá ngừ với chút muối tiêu trong ${s2} phút cho chín thơm vàng đều hai mặt.`,
      `Bước 3: Làm nóng vỏ bánh (${s3} phút) - Đặt vỏ bánh (bánh wrap hoặc bánh mì nguyên cám) lên chảo không dính áp nóng 1-2 phút mỗi mặt cho vỏ bánh giòn thơm dẻo dai.`,
      `Bước 4: Cuộn/kẹp bánh và thêm sốt (${s4} phút) - Trải vỏ bánh ra thớt sạch, phết một lớp mỏng sốt sữa chua Hy Lạp hoặc mù tạt vàng, xếp rau xà lách, cà chua và nhân đạm lên trên rồi cuộn chặt tay hoặc kẹp lại.`,
      `Bước 5: Cắt bánh và thưởng thức (${s5} phút) - Dùng dao sắc cắt đôi bánh theo đường chéo để lộ phần nhân bắt mắt. Thưởng thức ngay cho bữa ăn tiện lợi, giàu dinh dưỡng.`
    ];
  }

  // 12. SINH TỐ / SMOOTHIE / NƯỚC ÉP / ĐỒ UỐNG / YẾN MẠCH
  else if (lower.includes('sinh tố') || lower.includes('smoothie') || lower.includes('nước ép') || lower.includes('sữa') || lower.includes('overnight')) {
    steps = [
      `Bước 1: Sơ chế hoa quả và nguyên liệu (3 phút) - Rửa sạch các loại trái cây (${mainIng}). Gọt vỏ, bỏ hạt và cắt thành từng miếng nhỏ để dễ xay nhuyễn.`,
      `Bước 2: Chuẩn bị máy xay và đồ phụ trợ (2 phút) - Vệ sinh cối xay khô ráo. Chuẩn bị sữa hạt hoặc sữa tươi không đường, sữa chua Hy Lạp và đá viên tinh khiết.`,
      `Bước 3: Cho nguyên liệu vào cối xay (2 phút) - Cho hoa quả cắt nhỏ, 1 muỗng whey protein hoặc hạt chia, đổ 150ml sữa vào cối xay.`,
      `Bước 4: Xay nhuyễn mịn đồng nhất (3 phút) - Bật máy xay ở tốc độ vừa rồi tăng dần trong 3 phút đến khi hỗn hợp sánh mịn, hòa quyện mượt mà không còn cặn lợn cợn.`,
      `Bước 5: Rót ra ly và thưởng thức (2 phút) - Rót sinh tố thơm mát ra ly, rắc vài hạt hạnh nhân hoặc yến mạch lên trên và thưởng thức ngay để hấp thu trọn vẹn chất chống oxy hóa.`
    ];
  }

  // 13. NƯỚNG
  else if (lower.includes('nướng')) {
    let s1 = 4, s2 = 5, s3 = 3, s4 = 10, s5 = 2;
    steps = [
      `Bước 1: Sơ chế và khía thịt (${s1} phút) - Rửa sạch ${mainIng} với nước muối loãng, thấm khô bằng khăn giấy. Khía nhẹ vài đường trên miếng thịt để gia vị ướp ngấm sâu vào trong.`,
      `Bước 2: Ướp sốt nướng đậm vị (${s2} phút) - Pha sốt nướng với mật ong, dầu hào, tỏi ớt băm, tiêu đen và xíu dầu ô liu. Xoa đều sốt lên các mặt thịt và ướp trong ${s2} phút.`,
      `Bước 3: Làm nóng nồi chiên không dầu/lò nướng (${s3} phút) - Bật lò nướng hoặc nồi chiên không dầu ở nhiệt độ 180°C làm nóng trước trong 3 phút để nhiệt độ ổn định.`,
      `Bước 4: Nướng chín vàng giòn (${s4} phút) - Xếp thịt vào khay nướng, nướng ở 180°C trong ${s4} phút. Giữa chừng lật mặt và quét thêm một lớp sốt mỏng cho thịt lên màu vàng óng, thơm lừng không bị khô.`,
      `Bước 5: Để thịt nghỉ và thưởng thức (${s5} phút) - Lấy thịt ra đĩa để nghỉ 2 phút cho nước thịt ngấm ngược vào trong thớ thịt, cắt miếng vừa ăn và dùng kèm rau sống tươi giòn.`
    ];
  }

  // 14. DEFAULT CHO TẤT CẢ MÓN CÒN LẠI (Luôn đủ 5 bước chi tiết chuyên sâu)
  else {
    let s1 = 4, s2 = 5, s3 = 6, s4 = 3, s5 = 2;
    steps = [
      `Bước 1: Sơ chế nguyên liệu tươi ngon (${s1} phút) - Rửa sạch toàn bộ các nguyên liệu chính (${mainIng}) dưới vòi nước chảy. Thái lát hoặc cắt khúc vừa ăn, để ráo nước hoàn toàn.`,
      `Bước 2: Tẩm ướp gia vị thanh đạm (${s2} phút) - Ướp nguyên liệu với một chút muối hồng, tiêu đen xay, tỏi hành băm nhỏ trong ${s2} phút cho thấm đều hương vị đặc trưng.`,
      `Bước 3: Chế biến nhiệt chuẩn vị (${s3} phút) - Đặt chảo hoặc nồi lên bếp với một lượng nhỏ dầu ô liu, tiến hành nấu/xào/áp chảo ở nhiệt độ vừa phải trong ${s3} phút để chín đều từ trong ra ngoài giữ trọn độ mọng nước.`,
      `Bước 4: Nêm nếm cân bằng dinh dưỡng (${s4} phút) - Thêm nước sốt hoặc rau củ ăn kèm, đảo nhẹ tay và nêm lại cho vừa khẩu vị trong ${s4} phút, bảo toàn tối đa vitamin và vi chất.`,
      `Bước 5: Bày biện và thưởng thức (${s5} phút) - Tắt bếp, gắp món ăn ra đĩa sạch, rắc thêm chút hành ngò hoặc tiêu xay thơm lừng. Thưởng thức ngay khi còn nóng hổi.`
    ];
  }

  return steps.join('\n');
}

module.exports = { buildDetailedSteps, cleanTitle };

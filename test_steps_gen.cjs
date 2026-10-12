const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://eatgym:change-me@localhost:5432/eatgym' });

function cleanTitle(raw) {
  return raw.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\s]+/u, '').trim();
}

function generateDetailedSteps(dishTitle, ingredients, totalTime = 20) {
  const name = cleanTitle(dishTitle);
  const lower = name.toLowerCase();
  const ingList = (ingredients || []).filter(Boolean);
  const mainIng = ingList.length > 0 ? ingList.slice(0, 3).join(', ') : name;

  let steps = [];
  let t = Math.max(totalTime, 15);

  if (lower.includes('cháo')) {
    const s1 = Math.round(t * 0.2) || 4;
    const s2 = Math.round(t * 0.3) || 6;
    const s3 = Math.round(t * 0.3) || 5;
    const s4 = Math.round(t * 0.1) || 3;
    const s5 = 2;
    steps = [
      `Bước 1: Sơ chế nguyên liệu (${s1} phút) - Rửa sạch các nguyên liệu chính (${mainIng}). Với thịt hoặc sườn, chần nhanh qua nước sôi có thả nhánh gừng để khử mùi tanh và bọt bẩn. Gạo vo sạch rồi ngâm nước ấm giúp hạt gạo nở nhanh.`,
      `Bước 2: Nấu nước hầm xương/thịt (${s2} phút) - Đặt nồi nước lên bếp đun sôi, cho thịt/sườn và vài lát gừng cùng củ hành tím đập dập vào hầm lửa nhỏ. Thường xuyên hớt bọt để nước dùng trong và ngọt thanh tự nhiên.`,
      `Bước 3: Nấu cháo sánh nhừ (${s3} phút) - Cho gạo đã ráo vào nồi nước hầm, khuấy đều nhẹ tay theo một chiều để gạo không bị dính đáy nồi. Hạ lửa nhỏ ninh lăn tăn đến khi hạt gạo bung nở mềm và sánh mịn.`,
      `Bước 4: Nêm nếm chuẩn vị (${s4} phút) - Nêm chút muối hồng, nước mắm thơm và hạt nêm thanh đạm. Khuấy đều để vị ngọt tự nhiên của thịt hòa quyện vào từng thìa cháo.`,
      `Bước 5: Hoàn thiện & Thưởng thức (${s5} phút) - Múc cháo nóng hổi ra tô, rắc thêm hành lá, ngò rí cắt nhỏ cùng tiêu xay thơm lừng. Dùng ngay khi còn nóng ấm để bồi bổ cơ thể và phục hồi cơ bắp.`
    ];
  } else if (lower.includes('đậu hủ dồn thịt') || lower.includes('dồn thịt') || lower.includes('nhồi thịt') || lower.includes('đậu hũ')) {
    const s1 = 5;
    const s2 = 5;
    const s3 = Math.round(t * 0.35) || 7;
    const s4 = Math.round(t * 0.25) || 5;
    const s5 = 2;
    steps = [
      `Bước 1: Sơ chế nguyên liệu (${s1} phút) - Đậu hũ rửa nhẹ qua nước ấm, để ráo rồi rạch một đường giữa hoặc khoét nhẹ ruột đậu. Thịt nạc vai rửa sạch, băm nhuyễn cùng mộc nhĩ và hành khô.`,
      `Bước 2: Ướp và nhồi nhân (${s2} phút) - Trộn đều thịt băm với 1 thìa cà phê nước mắm, tiêu xay và hành tím băm. Để ngấm vị rồi khéo léo nhồi phần nhân thịt vào từng miếng đậu hũ cho đầy đặn.`,
      `Bước 3: Áp chảo săn vàng mặt thịt (${s3} phút) - Quét một lớp mỏng dầu ô liu lên chảo chống dính, đặt mặt thịt của đậu hũ xuống áp chảo lửa vừa trong ${s3} phút cho xém vàng thơm và cố định nhân thịt.`,
      `Bước 4: Om sốt cà chua đậm đà (${s4} phút) - Phi thơm hành, xào cà chua băm nhuyễn với chút nước lọc cho thành sốt sệt, xếp các miếng đậu vào đậy nắp om nhỏ lửa trong ${s4} phút cho sốt ngấm sâu vào đậu và thịt.`,
      `Bước 5: Hoàn thiện & Trình bày (${s5} phút) - Nêm lại xíu gia vị vừa miệng, rắc hành hoa thái nhỏ và tiêu xay lên trên. Gắp ra đĩa dùng nóng kèm cơm gạo lứt hoặc rau củ luộc.`
    ];
  } else if (lower.includes('canh') || lower.includes('soup') || lower.includes('súp')) {
    const s1 = Math.round(t * 0.25) || 4;
    const s2 = Math.round(t * 0.25) || 5;
    const s3 = Math.round(t * 0.3) || 6;
    const s4 = Math.round(t * 0.1) || 3;
    const s5 = 2;
    steps = [
      `Bước 1: Sơ chế rau củ và thịt (${s1} phút) - Rửa sạch ${mainIng}. Rau củ gọt vỏ thái miếng vừa ăn. Thịt/tôm rửa sạch khử tanh, thái lát mỏng hoặc băm nhỏ.`,
      `Bước 2: Phi thơm hành & Nấu nước dùng (${s2} phút) - Làm nóng nồi với 1 thìa cà phê dầu ô liu, phi thơm hành tím băm rồi cho phần thịt/tôm vào đảo săn trong 2 phút, sau đó chế 800ml nước lọc đun sôi.`,
      `Bước 3: Nấu chín các nguyên liệu (${s3} phút) - Khi nước sôi bùng, thả các loại rau củ vào nồi. Đun lửa vừa trong ${s3} phút để rau củ chín mềm, ngọt nước mà vẫn giữ được màu xanh tươi và vitamin.`,
      `Bước 4: Nêm gia vị thanh ngọt (${s4} phút) - Nêm 1 thìa nhỏ muối hồng, hạt nêm rau củ và nước mắm ngon. Nếm thử để đạt vị ngọt thanh tự nhiên, hớt bọt mặt nước cho canh thật trong.`,
      `Bước 5: Thưởng thức món canh thanh mát (${s5} phút) - Tắt bếp, rắc hành ngò thái nhỏ và tiêu xay. Múc canh ra tô lớn, dùng kèm bữa chính giúp bổ sung nước và chất xơ tuyệt vời.`
    ];
  } else if (lower.includes('xào')) {
    const s1 = Math.round(t * 0.25) || 4;
    const s2 = Math.round(t * 0.2) || 3;
    const s3 = Math.round(t * 0.25) || 4;
    const s4 = Math.round(t * 0.2) || 4;
    const s5 = 2;
    steps = [
      `Bước 1: Sơ chế và cắt thái (${s1} phút) - Rửa sạch ${mainIng}. Phần đạm thái mỏng ngang thớ. Rau củ thái lát hoặc cắt khúc vừa ăn để khi xào chín đều giòn ngon.`,
      `Bước 2: Ướp đạm & Chuẩn bị sốt xào (${s2} phút) - Ướp thịt/hải sản với 1 thìa tỏi băm, xíu dầu hào và tiêu trong ${s2} phút. Chuẩn bị sẵn chén sốt xào nhẹ vị.`,
      `Bước 3: Xào săn phần đạm (${s3} phút) - Làm nóng chảo chống dính với 1 thìa dầu ô liu, phi thơm tỏi rồi trút thịt vào đảo nhanh tay trên lửa lớn trong ${s3} phút cho chín tái rồi trút riêng ra đĩa.`,
      `Bước 4: Xào rau củ & Hòa quyện (${s4} phút) - Cho tiếp rau củ vào chảo đảo đều lửa lớn trong 2 phút, trút phần thịt đã xào vào cùng sốt xào, đảo nhanh tay trong ${s4 - 2} phút cho tất cả ngấm đều vị giòn ngọt.`,
      `Bước 5: Hoàn thiện món xào giòn ngọt (${s5} phút) - Rắc hành lá cắt khúc, ớt sợi và tiêu xay thơm nức, tắt bếp và trút ngay ra đĩa thưởng thức khi còn nóng hổi.`
    ];
  } else if (lower.includes('áp chảo') || lower.includes('bít tết') || lower.includes('steak')) {
    const s1 = Math.round(t * 0.2) || 3;
    const s2 = Math.round(t * 0.25) || 5;
    const s3 = Math.round(t * 0.3) || 5;
    const s4 = Math.round(t * 0.15) || 3;
    const s5 = 2;
    steps = [
      `Bước 1: Sơ chế và thấm khô (${s1} phút) - Rửa sạch ${mainIng} với nước muối loãng, dùng khăn giấy nhà bếp thấm thật khô ráo bề mặt để khi áp chảo miếng thịt đạt độ vàng xém đẹp mắt.`,
      `Bước 2: Tẩm ướp gia vị thảo mộc (${s2} phút) - Rắc đều muối hồng, tiêu đen xay thô, tỏi băm và lá thảo mộc (rosemary/thyme) lên hai mặt. Để ngấm đều gia vị trong ${s2} phút.`,
      `Bước 3: Áp chảo khóa ẩm (${s3} phút) - Làm nóng chảo gang với 1 thìa dầu ô liu ở nhiệt độ cao. Đặt miếng thịt vào áp chảo lửa vừa trong ${s3} phút (khoảng 2.5 phút mỗi mặt) để khóa trọn dòng nước ngọt bên trong.`,
      `Bước 4: Rưới bơ tỏi thơm lừng (${s4} phút) - Thả tép tỏi đập dập và nhánh thảo mộc vào chảo, nghiêng chảo múc dầu thơm rưới liên tục lên miếng thịt trong ${s4} phút cho bề mặt mướt bóng dậy mùi thơm.`,
      `Bước 5: Để thịt nghỉ & Thưởng thức (${s5} phút) - Gắp thịt ra thớt để nghỉ ${s5} phút giúp thớ thịt giữ trọn độ mọng nước tự nhiên, cắt lát xéo vừa ăn và thưởng thức cùng rau củ nướng.`
    ];
  } else if (lower.includes('hấp') || lower.includes('luộc')) {
    const s1 = Math.round(t * 0.25) || 4;
    const s2 = Math.round(t * 0.2) || 3;
    const s3 = 2;
    const s4 = Math.round(t * 0.45) || 8;
    const s5 = 2;
    steps = [
      `Bước 1: Sơ chế và làm sạch (${s1} phút) - Rửa sạch ${mainIng} dưới vòi nước chảy. Khía nhẹ vài đường trên thân nguyên liệu để hơi nóng và hương thơm ngấm sâu vào bên trong.`,
      `Bước 2: Ướp gừng sả thơm mát (${s2} phút) - Sả đập dập cắt khúc, gừng cạo vỏ thái sợi chỉ, hành lá rửa sạch. Ướp nhẹ cùng chút muối hồng và tiêu xay lên nguyên liệu trong ${s2} phút.`,
      `Bước 3: Đun sôi xửng hấp (${s3} phút) - Cho nước sạch vào đáy nồi hấp cùng vài lát gừng, đậy nắp đun sôi bốc hơi nghi ngút để chuẩn bị nhiệt độ tối ưu.`,
      `Bước 4: Hấp chín giữ trọn dinh dưỡng (${s4} phút) - Xếp nguyên liệu vào xửng hấp, rải gừng sả lên trên, đậy kín nắp hấp cách thủy trong ${s4} phút ở lửa vừa đến khi chín mềm ngọt thịt mà không thất thoát vi chất.`,
      `Bước 5: Thưởng thức cùng sốt chấm (${s5} phút) - Pha chén nước chấm gừng tỏi ớt ít muối hoặc muối tiêu chanh tươi. Gắp món hấp nóng bốc khói ra đĩa và thưởng thức ngay.`
    ];
  } else if (lower.includes('kho') || lower.includes('rim') || lower.includes('om') || lower.includes('sốt')) {
    const s1 = Math.round(t * 0.2) || 4;
    const s2 = Math.round(t * 0.25) || 5;
    const s3 = Math.round(t * 0.2) || 4;
    const s4 = Math.round(t * 0.25) || 6;
    const s5 = 2;
    steps = [
      `Bước 1: Sơ chế nguyên liệu tươi (${s1} phút) - Rửa sạch ${mainIng}, cắt khúc hoặc thái miếng vuông vừa ăn. Khử tanh bằng rượu trắng hoặc nước gừng, để ráo nước.`,
      `Bước 2: Ướp gia vị đậm đà (${s2} phút) - Ướp nguyên liệu với nước mắm ngon, tiêu xay, hành tỏi băm nhỏ và xíu mật ong/nước màu tự nhiên trong ${s2} phút cho thấm sâu vào từng thớ thịt.`,
      `Bước 3: Xào săn nguyên liệu (${s3} phút) - Cho chút dầu ô liu vào nồi đất hoặc chảo dày, phi thơm tỏi hành rồi trút nguyên liệu vào đảo đều trong ${s3} phút cho săn chắc và lên màu cánh gián đẹp mắt.`,
      `Bước 4: Kho/Om nhỏ lửa (${s4} phút) - Chế thêm nửa chén nước ấm hoặc nước dừa tươi, đun sôi rồi hạ nhỏ lửa đậy nắp om liu riu trong ${s4} phút đến khi nước sốt sánh lại, đậm vị ngọt bùi.`,
      `Bước 5: Hoàn thiện món kho thơm lừng (${s5} phút) - Mở nắp, thêm ớt hiểm và hành hoa cắt khúc, đảo nhẹ 1 phút rồi tắt bếp. Múc ra đĩa dùng cùng cơm nóng hoặc rau luộc.`
    ];
  } else if (lower.includes('salad') || lower.includes('gỏi') || lower.includes('trộn')) {
    const s1 = Math.round(t * 0.3) || 5;
    const s2 = Math.round(t * 0.3) || 5;
    const s3 = Math.round(t * 0.2) || 3;
    const s4 = Math.round(t * 0.15) || 2;
    const s5 = 2;
    steps = [
      `Bước 1: Sơ chế rau củ tươi sạch (${s1} phút) - Rửa sạch các loại rau sống, xà lách, cà chua bi, dưa leo (${mainIng}) với nước muối loãng, để ráo nước rồi cắt miếng vừa ăn. Giữ lạnh để giữ độ giòn tươi.`,
      `Bước 2: Chế biến phần đạm topping (${s2} phút) - Luộc hoặc áp chảo chín tới phần ức gà/trứng/tôm/đậu hũ với chút muối tiêu trong ${s2} phút, sau đó xé sợi hoặc thái lát mỏng đẹp mắt.`,
      `Bước 3: Pha sốt trộn Eat-Clean (${s3} phút) - Khuấy đều 1 thìa dầu ô liu nguyên chất, nước cốt chanh tươi/giấm táo, xíu mật ong, tiêu đen xay và tỏi ớt băm nhuyễn tạo thành sốt sánh mịn chua ngọt thanh tao.`,
      `Bước 4: Trộn đều nguyên liệu (${s4} phút) - Cho toàn bộ rau củ và topping đạm vào âu lớn, rưới đều nước sốt rồi dùng tay nhẹ nhàng đảo từ dưới lên để rau thấm đều vị mà không bị dập nát.`,
      `Bước 5: Rắc hạt dinh dưỡng & Thưởng thức (${s5} phút) - Bày salad ra đĩa sâu lòng, rắc thêm mè rang hoặc hạt hạnh nhân đập dập lên trên để tăng độ bùi béo tốt cho tim mạch, thưởng thức ngay.`
    ];
  } else if (lower.includes('cơm') || lower.includes('xôi')) {
    const s1 = Math.round(t * 0.25) || 4;
    const s2 = Math.round(t * 0.25) || 5;
    const s3 = Math.round(t * 0.25) || 5;
    const s4 = Math.round(t * 0.15) || 3;
    const s5 = 2;
    steps = [
      `Bước 1: Sơ chế nguyên liệu ăn kèm (${s1} phút) - Rửa sạch các nguyên liệu (${mainIng}). Thái hạt lựu rau củ và thịt đạm. Chuẩn bị phần cơm gạo lứt hoặc cơm trắng đã nấu chín để nguội.`,
      `Bước 2: Tẩm ướp và xào đạm (${s2} phút) - Ướp thịt với xíu tiêu và nước tương. Phi thơm hành tím với 1 thìa dầu ô liu, xào săn chín thịt và trút ra đĩa riêng.`,
      `Bước 3: Rang/Đảo cơm tơi xốp (${s3} phút) - Cho cơm vào chảo đảo đều tay trên lửa vừa trong ${s3} phút cho hạt cơm săn lại và tơi đều. Có thể đánh tan 1 quả trứng rưới vào đảo đều để tạo màu vàng óng.`,
      `Bước 4: Hòa quyện cơm và rau củ (${s4} phút) - Trút toàn bộ phần thịt đạm và rau củ vào chảo cơm, nêm 1 thìa dầu hào thanh vị, đảo nhanh tay trên lửa lớn trong ${s4} phút cho ngấm đều hương vị.`,
      `Bước 5: Trình bày & Thưởng thức (${s5} phút) - Rắc hành lá thái nhỏ và tiêu xay thơm nức, xới cơm ra đĩa hoặc chén, ăn kèm dưa leo, cà chua tươi thanh mát.`
    ];
  } else if (lower.includes('bún') || lower.includes('phở') || lower.includes('hủ tiếu') || lower.includes('mì') || lower.includes('miến')) {
    const s1 = Math.round(t * 0.25) || 4;
    const s2 = Math.round(t * 0.3) || 6;
    const s3 = Math.round(t * 0.25) || 4;
    const s4 = Math.round(t * 0.15) || 3;
    const s5 = 2;
    steps = [
      `Bước 1: Sơ chế thịt đạm và rau thơm (${s1} phút) - Rửa sạch ${mainIng}. Thịt rửa sạch thái lát mỏng hoặc trần sơ. Rau sống, giá đỗ, hành ngò nhặt sạch rửa qua nước muối loãng, để ráo.`,
      `Bước 2: Nấu nước dùng thanh ngọt (${s2} phút) - Cho xương/thịt và gừng nướng, củ hành nướng vào nồi nước đun sôi liu riu trong ${s2} phút, hớt sạch bọt. Nêm gia vị muối tiêu, quế hồi thanh đạm tạo hương vị đặc trưng.`,
      `Bước 3: Trụng sợi bún/phở/mì (${s3} phút) - Đun sôi một nồi nước khác, cho sợi bún/phở/mì vào trụng nhanh trong ${s3} phút cho mềm dai, vớt ra ráo nước và chia đều vào từng tô.`,
      `Bước 4: Xếp nhân và chan nước dùng (${s4} phút) - Xếp thịt chín mềm, hành hoa thái nhỏ, ớt lát và rau thơm lên mặt tô bún. Chan nước dùng sôi sùng sục ngập mặt bún trong ${s4} phút.`,
      `Bước 5: Thưởng thức tô bún phở nóng hổi (${s5} phút) - Vắt thêm chút chanh tươi, thêm vài cọng ớt hiểm, ăn kèm đĩa rau sống tươi giòn đầy đủ protein và carb lành mạnh.`
    ];
  } else if (lower.includes('sinh tố') || lower.includes('smoothie') || lower.includes('nước ép') || lower.includes('sữa')) {
    steps = [
      `Bước 1: Sơ chế hoa quả và nguyên liệu (3 phút) - Rửa sạch ${mainIng}. Gọt vỏ, bỏ hạt và cắt thành từng miếng nhỏ để dễ xay nhuyễn.`,
      `Bước 2: Chuẩn bị máy xay và nguyên liệu phụ (2 phút) - Vệ sinh cối xay khô ráo. Chuẩn bị sữa chua Hy Lạp, sữa tươi không đường hoặc đá viên tinh khiết.`,
      `Bước 3: Cho nguyên liệu vào cối xay (2 phút) - Cho hoa quả cắt nhỏ, 1 muỗng whey protein hoặc hạt chia (nếu có), thêm 150ml sữa vào cối xay.`,
      `Bước 4: Xay nhuyễn mịn đồng nhất (3 phút) - Bật máy xay ở tốc độ vừa rồi tăng dần trong 3 phút đến khi hỗn hợp sánh mịn, hòa quyện mượt mà không còn cặn lợn cợn.`,
      `Bước 5: Rót ra ly và thưởng thức (2 phút) - Rót sinh tố thơm mát ra ly, trang trí vài lát hoa quả hoặc hạt dinh dưỡng lên trên và thưởng thức ngay để hấp thu trọn vẹn chất chống oxy hóa.`
    ];
  } else {
    // Generic high-quality 5-step culinary process tailored to dish name and ingredients
    const s1 = Math.round(t * 0.2) || 4;
    const s2 = Math.round(t * 0.25) || 5;
    const s3 = Math.round(t * 0.3) || 6;
    const s4 = Math.round(t * 0.15) || 3;
    const s5 = 2;
    steps = [
      `Bước 1: Sơ chế nguyên liệu tươi ngon (${s1} phút) - Làm sạch toàn bộ nguyên liệu chính (${mainIng}), rửa dưới vòi nước chảy. Thái miếng hoặc cắt khúc vừa ăn, để ráo nước hoàn toàn.`,
      `Bước 2: Tẩm ướp gia vị thanh đạm (${s2} phút) - Ướp nguyên liệu với một chút muối hồng, tiêu xay, tỏi hành băm nhỏ trong ${s2} phút cho thấm đều hương vị đặc trưng.`,
      `Bước 3: Chế biến nhiệt chuẩn vị (${s3} phút) - Đặt chảo hoặc nồi lên bếp với một lượng rất nhỏ dầu ô liu, tiến hành nấu/áp chảo/xào ở nhiệt độ vừa phải trong ${s3} phút để chín đều từ trong ra ngoài.`,
      `Bước 4: Nêm nếm cân bằng dinh dưỡng (${s4} phút) - Thêm chút nước sốt hoặc rau củ ăn kèm, đảo nhẹ tay và nêm lại cho vừa khẩu vị trong ${s4} phút, bảo toàn độ mọng nước và vi chất.`,
      `Bước 5: Bày biện và thưởng thức (${s5} phút) - Tắt bếp, gắp món ăn ra đĩa sạch, trang trí thêm chút hành ngò hoặc tiêu xay thơm lừng. Thưởng thức ngay khi còn nóng hổi.`
    ];
  }

  return steps.join('\n');
}

// Test with Dau hu don thit and Chao suon
console.log('--- TEST ĐẬU HỦ DỒN THỊT ---');
console.log(generateDetailedSteps('🍖 Đậu hủ dồn thịt', ['Đậu hũ', 'Thịt nạc vai', 'Mộc nhĩ'], 20));
console.log('\n--- TEST CHÁO SƯỜN ---');
console.log(generateDetailedSteps('🍖 Cháo sườn', ['Sườn non', 'Gạo tẻ', 'Hành hoa'], 15));
console.log('\n--- TEST ỨC GÀ ÁP CHẢO ---');
console.log(generateDetailedSteps('🍗 Ức gà áp chảo sốt tiêu', ['Ức gà phi lê', 'Tiêu đen', 'Dầu ô liu'], 15));

pool.end();

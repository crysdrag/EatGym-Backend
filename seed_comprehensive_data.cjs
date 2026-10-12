require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  console.log('--- STARTING COMPREHENSIVE SEEDING ---');

  // 1. INGREDIENTS LIST
  const ingredients = [
    // PROTEIN - THỊT, CÁ, HẢI SẢN, TRỨNG, ĐẬU
    { name: 'Ức gà không da', category: 'protein', kcal: 120.0, p: 26.0, c: 0.0, f: 1.8, icon: '🍗', unit: 'g' },
    { name: 'Đùi gà tháo xương', category: 'protein', kcal: 177.0, p: 24.0, c: 0.0, f: 8.5, icon: '🍗', unit: 'g' },
    { name: 'Cánh gà', category: 'protein', kcal: 203.0, p: 22.0, c: 0.0, f: 12.0, icon: '🍗', unit: 'g' },
    { name: 'Thịt gà ta thả vườn', category: 'protein', kcal: 199.0, p: 20.3, c: 0.0, f: 13.1, icon: '🍗', unit: 'g' },
    { name: 'Thịt thăn bò nạc', category: 'protein', kcal: 142.0, p: 26.1, c: 0.0, f: 3.5, icon: '🥩', unit: 'g' },
    { name: 'Bắp bò hoa', category: 'protein', kcal: 130.0, p: 25.0, c: 0.0, f: 3.0, icon: '🥩', unit: 'g' },
    { name: 'Nạc vai bò Úc', category: 'protein', kcal: 165.0, p: 24.0, c: 0.0, f: 7.5, icon: '🥩', unit: 'g' },
    { name: 'Gầu bò', category: 'protein', kcal: 251.0, p: 18.5, c: 0.0, f: 19.5, icon: '🥩', unit: 'g' },
    { name: 'Thịt bò xay nạc (Ground beef)', category: 'protein', kcal: 180.0, p: 23.0, c: 0.0, f: 9.5, icon: '🥩', unit: 'g' },
    { name: 'Thịt thăn heo nạc', category: 'protein', kcal: 136.0, p: 22.5, c: 0.0, f: 5.0, icon: '🥩', unit: 'g' },
    { name: 'Nạc vai heo', category: 'protein', kcal: 165.0, p: 19.0, c: 0.0, f: 9.8, icon: '🥩', unit: 'g' },
    { name: 'Thịt ba chỉ heo', category: 'protein', kcal: 260.0, p: 16.5, c: 0.0, f: 21.5, icon: '🥓', unit: 'g' },
    { name: 'Sườn non heo', category: 'protein', kcal: 220.0, p: 18.0, c: 0.0, f: 16.0, icon: '🥩', unit: 'g' },
    { name: 'Thịt heo nạc băm', category: 'protein', kcal: 155.0, p: 20.5, c: 0.0, f: 8.0, icon: '🥩', unit: 'g' },
    { name: 'Phi lê cá hồi', category: 'protein', kcal: 208.0, p: 20.4, c: 0.0, f: 13.4, icon: '🐟', unit: 'g' },
    { name: 'Cá ngừ đại dương', category: 'protein', kcal: 130.0, p: 28.0, c: 0.0, f: 1.0, icon: '🐟', unit: 'g' },
    { name: 'Cá ngừ hộp ngâm nước', category: 'protein', kcal: 116.0, p: 25.5, c: 0.0, f: 1.0, icon: '🐟', unit: 'g' },
    { name: 'Phi lê cá rô phi', category: 'protein', kcal: 96.0, p: 20.1, c: 0.0, f: 1.7, icon: '🐟', unit: 'g' },
    { name: 'Cá lóc đồng (Cá quả)', category: 'protein', kcal: 97.0, p: 18.2, c: 0.0, f: 2.7, icon: '🐟', unit: 'g' },
    { name: 'Cá điêu hồng', category: 'protein', kcal: 102.0, p: 19.5, c: 0.0, f: 2.5, icon: '🐟', unit: 'g' },
    { name: 'Phi lê cá ba sa', category: 'protein', kcal: 125.0, p: 17.5, c: 0.0, f: 6.0, icon: '🐟', unit: 'g' },
    { name: 'Cá thu tươi', category: 'protein', kcal: 189.0, p: 19.0, c: 0.0, f: 12.0, icon: '🐟', unit: 'g' },
    { name: 'Tôm sú bóc vỏ', category: 'protein', kcal: 99.0, p: 24.0, c: 0.2, f: 0.3, icon: '🦐', unit: 'g' },
    { name: 'Tôm thẻ tươi', category: 'protein', kcal: 92.0, p: 21.0, c: 0.5, f: 0.4, icon: '🦐', unit: 'g' },
    { name: 'Mực ống tươi', category: 'protein', kcal: 85.0, p: 17.5, c: 1.5, f: 0.9, icon: '🦑', unit: 'g' },
    { name: 'Bạch tuộc', category: 'protein', kcal: 82.0, p: 15.0, c: 2.2, f: 1.0, icon: '🐙', unit: 'g' },
    { name: 'Thịt cua biển', category: 'protein', kcal: 87.0, p: 19.0, c: 0.0, f: 1.2, icon: '🦀', unit: 'g' },
    { name: 'Nghêu (Ngao) thịt', category: 'protein', kcal: 74.0, p: 12.8, c: 2.6, f: 1.0, icon: '🐚', unit: 'g' },
    { name: 'Hàu sữa tươi', category: 'protein', kcal: 68.0, p: 9.0, c: 4.0, f: 2.0, icon: '🦪', unit: 'g' },
    { name: 'Trứng gà', category: 'protein', kcal: 143.0, p: 12.6, c: 0.7, f: 9.5, icon: '🥚', unit: 'quả' },
    { name: 'Lòng trắng trứng gà', category: 'protein', kcal: 52.0, p: 11.0, c: 0.7, f: 0.2, icon: '🥚', unit: 'g' },
    { name: 'Trứng vịt', category: 'protein', kcal: 185.0, p: 13.0, c: 1.0, f: 14.5, icon: '🥚', unit: 'quả' },
    { name: 'Trứng cút', category: 'protein', kcal: 158.0, p: 13.0, c: 0.5, f: 11.0, icon: '🥚', unit: 'quả' },
    { name: 'Đậu hũ trắng mềm', category: 'protein', kcal: 76.0, p: 8.1, c: 1.9, f: 4.8, icon: '🧊', unit: 'g' },
    { name: 'Đậu hũ chiên', category: 'protein', kcal: 160.0, p: 13.0, c: 4.0, f: 10.5, icon: '🧈', unit: 'g' },
    { name: 'Đậu nành Edamame', category: 'protein', kcal: 121.0, p: 11.9, c: 8.9, f: 5.2, icon: '🫘', unit: 'g' },
    { name: 'Đậu gà (Chickpeas)', category: 'protein', kcal: 164.0, p: 8.9, c: 27.4, f: 2.6, icon: '🫘', unit: 'g' },
    { name: 'Đậu đen xanh lòng', category: 'protein', kcal: 325.0, p: 24.2, c: 53.3, f: 1.7, icon: '🫘', unit: 'g' },
    { name: 'Đậu xanh tách vỏ', category: 'protein', kcal: 328.0, p: 23.4, c: 53.1, f: 1.5, icon: '🫘', unit: 'g' },
    { name: 'Đậu đỏ hạt', category: 'protein', kcal: 329.0, p: 22.0, c: 55.0, f: 1.2, icon: '🫘', unit: 'g' },
    { name: 'Whey Protein Isolate', category: 'protein', kcal: 370.0, p: 85.0, c: 3.0, f: 1.5, icon: '🥛', unit: 'g' },

    // CARB - TINH BỘT, NGŨ CỐC, KHOAI
    { name: 'Cơm trắng', category: 'carb', kcal: 130.0, p: 2.7, c: 28.2, f: 0.3, icon: '🍚', unit: 'g' },
    { name: 'Gạo tẻ trắng', category: 'carb', kcal: 344.0, p: 7.5, c: 76.0, f: 1.0, icon: '🍚', unit: 'g' },
    { name: 'Gạo lứt', category: 'carb', kcal: 111.0, p: 2.6, c: 23.0, f: 0.9, icon: '🍚', unit: 'g' },
    { name: 'Cơm gạo lứt huyết rồng', category: 'carb', kcal: 115.0, p: 3.0, c: 23.5, f: 1.0, icon: '🍚', unit: 'g' },
    { name: 'Khoai lang mật', category: 'carb', kcal: 86.0, p: 1.6, c: 20.1, f: 0.1, icon: '🍠', unit: 'g' },
    { name: 'Khoai lang tím', category: 'carb', kcal: 90.0, p: 1.8, c: 21.0, f: 0.1, icon: '🍠', unit: 'g' },
    { name: 'Khoai tây tươi', category: 'carb', kcal: 77.0, p: 2.0, c: 17.5, f: 0.1, icon: '🥔', unit: 'g' },
    { name: 'Khoai môn', category: 'carb', kcal: 112.0, p: 1.5, c: 26.5, f: 0.2, icon: '🥔', unit: 'g' },
    { name: 'Yến mạch cán dẹt', category: 'carb', kcal: 389.0, p: 16.9, c: 66.3, f: 6.9, icon: '🥣', unit: 'g' },
    { name: 'Bánh phở tươi', category: 'carb', kcal: 140.0, p: 3.2, c: 31.0, f: 0.4, icon: '🍜', unit: 'g' },
    { name: 'Bún tươi', category: 'carb', kcal: 110.0, p: 1.7, c: 25.5, f: 0.2, icon: '🍜', unit: 'g' },
    { name: 'Bún gạo lứt', category: 'carb', kcal: 125.0, p: 3.5, c: 27.0, f: 0.5, icon: '🍜', unit: 'g' },
    { name: 'Bún nưa Konjac', category: 'carb', kcal: 10.0, p: 0.2, c: 2.3, f: 0.1, icon: '🍜', unit: 'g' },
    { name: 'Miến dong', category: 'carb', kcal: 332.0, p: 0.7, c: 82.0, f: 0.1, icon: '🍜', unit: 'g' },
    { name: 'Mì Ý Spaghetti (khô)', category: 'carb', kcal: 355.0, p: 12.5, c: 72.0, f: 1.8, icon: '🍝', unit: 'g' },
    { name: 'Bánh mì đen nguyên cám', category: 'carb', kcal: 250.0, p: 9.0, c: 48.0, f: 3.0, icon: '🍞', unit: 'g' },
    { name: 'Bánh mì trắng baguette', category: 'carb', kcal: 265.0, p: 8.5, c: 52.0, f: 2.0, icon: '🥖', unit: 'g' },
    { name: 'Bánh wrap nguyên cám', category: 'carb', kcal: 280.0, p: 9.0, c: 48.0, f: 5.5, icon: '🌯', unit: 'g' },
    { name: 'Bắp ngọt tách hạt (Ngô)', category: 'carb', kcal: 86.0, p: 3.2, c: 19.0, f: 1.2, icon: '🌽', unit: 'g' },
    { name: 'Hạt Diêm Mạch (Quinoa)', category: 'carb', kcal: 120.0, p: 4.4, c: 21.3, f: 1.9, icon: '🌾', unit: 'g' },

    // VEGETABLE - RAU XANH, CỦ QUẢ, NẤM
    { name: 'Bông cải xanh (Broccoli)', category: 'vegetable', kcal: 34.0, p: 2.8, c: 6.6, f: 0.4, icon: '🥦', unit: 'g' },
    { name: 'Súp lơ trắng (Cauliflower)', category: 'vegetable', kcal: 25.0, p: 1.9, c: 5.0, f: 0.3, icon: '🥦', unit: 'g' },
    { name: 'Bắp cải trắng', category: 'vegetable', kcal: 24.0, p: 1.3, c: 5.6, f: 0.1, icon: '🥬', unit: 'g' },
    { name: 'Bắp cải tím', category: 'vegetable', kcal: 28.0, p: 1.5, c: 6.5, f: 0.1, icon: '🥬', unit: 'g' },
    { name: 'Cải thìa (Bok choy)', category: 'vegetable', kcal: 13.0, p: 1.5, c: 2.2, f: 0.2, icon: '🥬', unit: 'g' },
    { name: 'Cải ngọt', category: 'vegetable', kcal: 15.0, p: 1.6, c: 2.5, f: 0.2, icon: '🥬', unit: 'g' },
    { name: 'Cải bó xôi (Rau chân vịt)', category: 'vegetable', kcal: 23.0, p: 2.9, c: 3.6, f: 0.4, icon: '🥬', unit: 'g' },
    { name: 'Rau muống', category: 'vegetable', kcal: 23.0, p: 3.0, c: 2.8, f: 0.4, icon: '🥬', unit: 'g' },
    { name: 'Rau ngót', category: 'vegetable', kcal: 35.0, p: 5.3, c: 3.4, f: 0.6, icon: '🌿', unit: 'g' },
    { name: 'Rau mồng tơi', category: 'vegetable', kcal: 14.0, p: 1.4, c: 2.2, f: 0.2, icon: '🌿', unit: 'g' },
    { name: 'Rau dền đỏ', category: 'vegetable', kcal: 20.0, p: 2.1, c: 3.5, f: 0.3, icon: '🌿', unit: 'g' },
    { name: 'Xà lách Romaine', category: 'vegetable', kcal: 17.0, p: 1.2, c: 3.3, f: 0.3, icon: '🥬', unit: 'g' },
    { name: 'Cà chua bi', category: 'vegetable', kcal: 18.0, p: 0.9, c: 3.9, f: 0.2, icon: '🍅', unit: 'g' },
    { name: 'Cà chua chín', category: 'vegetable', kcal: 20.0, p: 1.0, c: 4.2, f: 0.2, icon: '🍅', unit: 'g' },
    { name: 'Dưa leo (Dưa chuột)', category: 'vegetable', kcal: 15.0, p: 0.7, c: 3.6, f: 0.1, icon: '🥒', unit: 'g' },
    { name: 'Măng tây', category: 'vegetable', kcal: 20.0, p: 2.2, c: 3.9, f: 0.1, icon: '🌱', unit: 'g' },
    { name: 'Ớt chuông 3 màu', category: 'vegetable', kcal: 26.0, p: 1.0, c: 6.0, f: 0.3, icon: '🫑', unit: 'g' },
    { name: 'Cà rốt', category: 'vegetable', kcal: 41.0, p: 0.9, c: 9.6, f: 0.2, icon: '🥕', unit: 'g' },
    { name: 'Bí đỏ (Bí ngô)', category: 'vegetable', kcal: 26.0, p: 1.0, c: 6.5, f: 0.1, icon: '🎃', unit: 'g' },
    { name: 'Bí đao (Bí xanh)', category: 'vegetable', kcal: 12.0, p: 0.6, c: 2.4, f: 0.1, icon: '🥒', unit: 'g' },
    { name: 'Mướp đắng (Khổ qua)', category: 'vegetable', kcal: 17.0, p: 1.0, c: 3.7, f: 0.2, icon: '🥒', unit: 'g' },
    { name: 'Đậu cove (Đậu que)', category: 'vegetable', kcal: 31.0, p: 1.8, c: 7.0, f: 0.2, icon: '🫛', unit: 'g' },
    { name: 'Đậu bắp', category: 'vegetable', kcal: 33.0, p: 1.9, c: 7.5, f: 0.2, icon: '🫛', unit: 'g' },
    { name: 'Hành tây', category: 'vegetable', kcal: 40.0, p: 1.1, c: 9.3, f: 0.1, icon: '🧅', unit: 'g' },
    { name: 'Hành lá tươi', category: 'vegetable', kcal: 32.0, p: 1.8, c: 7.3, f: 0.2, icon: '🌱', unit: 'g' },
    { name: 'Cần tây', category: 'vegetable', kcal: 16.0, p: 0.7, c: 3.0, f: 0.2, icon: '🌿', unit: 'g' },
    { name: 'Nấm đùi gà tươi', category: 'vegetable', kcal: 35.0, p: 3.3, c: 5.0, f: 0.4, icon: '🍄', unit: 'g' },
    { name: 'Nấm kim châm', category: 'vegetable', kcal: 37.0, p: 2.7, c: 7.8, f: 0.3, icon: '🍄', unit: 'g' },
    { name: 'Nấm hương tươi', category: 'vegetable', kcal: 34.0, p: 2.2, c: 6.8, f: 0.5, icon: '🍄', unit: 'g' },
    { name: 'Nấm rơm tươi', category: 'vegetable', kcal: 31.0, p: 3.5, c: 3.2, f: 0.5, icon: '🍄', unit: 'g' },
    { name: 'Rong biển khô Wakame', category: 'vegetable', kcal: 45.0, p: 5.0, c: 9.0, f: 0.5, icon: '🌿', unit: 'g' },
    { name: 'Giá đỗ xanh', category: 'vegetable', kcal: 30.0, p: 4.0, c: 3.0, f: 0.5, icon: '🌱', unit: 'g' },

    // FRUIT - TRÁI CÂY
    { name: 'Quả bơ sáp (Avocado)', category: 'fruit', kcal: 160.0, p: 2.0, c: 8.5, f: 14.7, icon: '🥑', unit: 'g' },
    { name: 'Chuối tiêu chín', category: 'fruit', kcal: 89.0, p: 1.1, c: 22.8, f: 0.3, icon: '🍌', unit: 'g' },
    { name: 'Táo đỏ', category: 'fruit', kcal: 52.0, p: 0.3, c: 13.8, f: 0.2, icon: '🍎', unit: 'g' },
    { name: 'Cam sành tươi', category: 'fruit', kcal: 47.0, p: 0.9, c: 11.8, f: 0.1, icon: '🍊', unit: 'g' },
    { name: 'Bưởi da xanh', category: 'fruit', kcal: 38.0, p: 0.8, c: 9.6, f: 0.1, icon: '🍈', unit: 'g' },
    { name: 'Ổi giòn', category: 'fruit', kcal: 68.0, p: 2.6, c: 14.3, f: 1.0, icon: '🍈', unit: 'g' },
    { name: 'Dưa hấu', category: 'fruit', kcal: 30.0, p: 0.6, c: 7.6, f: 0.2, icon: '🍉', unit: 'g' },
    { name: 'Thanh long ruột đỏ', category: 'fruit', kcal: 60.0, p: 1.2, c: 13.0, f: 0.6, icon: '🐉', unit: 'g' },
    { name: 'Việt quất tươi (Blueberry)', category: 'fruit', kcal: 57.0, p: 0.7, c: 14.5, f: 0.3, icon: '🫐', unit: 'g' },
    { name: 'Dâu tây Đà Lạt', category: 'fruit', kcal: 32.0, p: 0.7, c: 7.7, f: 0.3, icon: '🍓', unit: 'g' },
    { name: 'Kiwi xanh', category: 'fruit', kcal: 61.0, p: 1.1, c: 14.7, f: 0.5, icon: '🥝', unit: 'g' },
    { name: 'Xoài chín', category: 'fruit', kcal: 60.0, p: 0.8, c: 15.0, f: 0.4, icon: '🥭', unit: 'g' },
    { name: 'Dứa tươi (Thơm)', category: 'fruit', kcal: 50.0, p: 0.5, c: 13.1, f: 0.1, icon: '🍍', unit: 'g' },

    // FAT, DAIRY & NUTS - CHẤT BÉO, SỮA, HẠT
    { name: 'Dầu ô liu Extra Virgin', category: 'fat', kcal: 884.0, p: 0.0, c: 0.0, f: 100.0, icon: '🫒', unit: 'ml' },
    { name: 'Dầu ăn thực vật', category: 'fat', kcal: 884.0, p: 0.0, c: 0.0, f: 100.0, icon: '🫗', unit: 'ml' },
    { name: 'Dầu mè thơm', category: 'fat', kcal: 884.0, p: 0.0, c: 0.0, f: 100.0, icon: '🫗', unit: 'ml' },
    { name: 'Bơ lạt động vật (Butter)', category: 'fat', kcal: 717.0, p: 0.9, c: 0.1, f: 81.1, icon: '🧈', unit: 'g' },
    { name: 'Bơ đậu phộng tự nhiên', category: 'fat', kcal: 588.0, p: 25.0, c: 20.0, f: 50.0, icon: '🥜', unit: 'g' },
    { name: 'Sữa chua Hy Lạp không đường', category: 'dairy', kcal: 59.0, p: 10.0, c: 3.6, f: 0.4, icon: '🥣', unit: 'g' },
    { name: 'Sữa chua không đường', category: 'dairy', kcal: 63.0, p: 3.5, c: 4.7, f: 3.3, icon: '🥛', unit: 'hộp' },
    { name: 'Sữa tươi không đường', category: 'dairy', kcal: 60.0, p: 3.2, c: 4.8, f: 3.3, icon: '🥛', unit: 'ml' },
    { name: 'Sữa hạt hạnh nhân không đường', category: 'dairy', kcal: 15.0, p: 0.6, c: 0.3, f: 1.2, icon: '🥛', unit: 'ml' },
    { name: 'Phô mai Mozzarella', category: 'dairy', kcal: 280.0, p: 28.0, c: 3.1, f: 17.0, icon: '🧀', unit: 'g' },
    { name: 'Phô mai Cheddar lát', category: 'dairy', kcal: 402.0, p: 25.0, c: 1.3, f: 33.0, icon: '🧀', unit: 'lát' },
    { name: 'Hạt hạnh nhân rang mộc', category: 'fat', kcal: 579.0, p: 21.2, c: 21.6, f: 49.9, icon: '🥜', unit: 'g' },
    { name: 'Hạt óc chó', category: 'fat', kcal: 654.0, p: 15.2, c: 13.7, f: 65.2, icon: '🌰', unit: 'g' },
    { name: 'Hạt điều rang muối', category: 'fat', kcal: 553.0, p: 18.2, c: 30.2, f: 43.8, icon: '🥜', unit: 'g' },
    { name: 'Hạt chia hữu cơ', category: 'fat', kcal: 486.0, p: 16.5, c: 42.1, f: 30.7, icon: '🌱', unit: 'g' },
    { name: 'Lạc rang (Đậu phộng)', category: 'fat', kcal: 567.0, p: 25.8, c: 16.1, f: 49.2, icon: '🥜', unit: 'g' },

    // CONDIMENTS & SPICES - GIA VỊ, SỐT, NƯỚC CHẤM (BAO GỒM CHOLIMEX VÀ CÁC THỰC PHẨM VIỆT)
    { name: 'Tương ớt Cholimex', category: 'condiment', kcal: 95.0, p: 0.9, c: 22.8, f: 0.0, icon: '🌶️', unit: 'g' },
    { name: 'Tương cà chua Cholimex', category: 'condiment', kcal: 102.0, p: 1.2, c: 24.0, f: 0.2, icon: '🍅', unit: 'g' },
    { name: 'Nước mắm cá cơm truyền thống', category: 'condiment', kcal: 45.0, p: 10.0, c: 1.2, f: 0.0, icon: '🍶', unit: 'ml' },
    { name: 'Nước tương đậu nành (Xì dầu)', category: 'condiment', kcal: 53.0, p: 7.5, c: 5.5, f: 0.1, icon: '🥢', unit: 'ml' },
    { name: 'Dầu hào Maggi', category: 'condiment', kcal: 68.0, p: 3.2, c: 13.8, f: 0.2, icon: '🦪', unit: 'ml' },
    { name: 'Sốt mè rang Kewpie', category: 'condiment', kcal: 387.0, p: 2.5, c: 16.5, f: 35.0, icon: '🥗', unit: 'ml' },
    { name: 'Sốt Mayonnaise', category: 'condiment', kcal: 680.0, p: 1.0, c: 2.5, f: 75.0, icon: '🥣', unit: 'g' },
    { name: 'Mật ong nguyên chất', category: 'condiment', kcal: 304.0, p: 0.3, c: 82.4, f: 0.0, icon: '🍯', unit: 'ml' },
    { name: 'Tương đen ăn phở', category: 'condiment', kcal: 130.0, p: 2.0, c: 30.0, f: 0.5, icon: '🍲', unit: 'g' },
    { name: 'Tỏi băm', category: 'condiment', kcal: 149.0, p: 6.4, c: 33.1, f: 0.5, icon: '🧄', unit: 'g' },
    { name: 'Hành tím băm', category: 'condiment', kcal: 72.0, p: 2.5, c: 16.8, f: 0.1, icon: '🧅', unit: 'g' },
    { name: 'Gừng tươi', category: 'condiment', kcal: 80.0, p: 1.8, c: 17.8, f: 0.8, icon: '🫚', unit: 'g' },
    { name: 'Sả băm', category: 'condiment', kcal: 99.0, p: 1.8, c: 25.3, f: 0.5, icon: '🌾', unit: 'g' },
    { name: 'Ớt tươi', category: 'condiment', kcal: 40.0, p: 1.9, c: 8.8, f: 0.4, icon: '🌶️', unit: 'g' },
    { name: 'Tiêu đen xay', category: 'condiment', kcal: 251.0, p: 10.4, c: 64.0, f: 3.3, icon: '🧂', unit: 'g' }
  ];

  console.log(`Inserting/Updating ${ingredients.length} ingredients...`);
  for (const ing of ingredients) {
    await pool.query(`
      INSERT INTO ingredients (name, category, kcal_per_100g, protein_g, carbs_g, fat_g, icon, default_unit)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (name) DO UPDATE SET
        category = EXCLUDED.category,
        kcal_per_100g = EXCLUDED.kcal_per_100g,
        protein_g = EXCLUDED.protein_g,
        carbs_g = EXCLUDED.carbs_g,
        fat_g = EXCLUDED.fat_g,
        icon = EXCLUDED.icon,
        default_unit = EXCLUDED.default_unit
    `, [ing.name, ing.category, ing.kcal, ing.p, ing.c, ing.f, ing.icon, ing.unit]);
  }
  console.log('Ingredients seeded successfully!');

  // 2. RECIPES LIST - MÓN ĂN VIỆT NAM (NUTRIHOME) & MÓN ĂN GYM / HEALTHY QUỐC TẾ
  const recipes = [
    {
      title: 'Phở bò tái lăn Hà Nội',
      description: 'Món quốc hồn quốc túy Việt Nam, thăn bò xào tái nhanh lăn tỏi thơm lừng hòa quyện cùng nước dùng ninh xương đậm đà, bánh phở mềm mướt.',
      kcal: 510.0, p: 38.0, c: 62.0, f: 12.0,
      time: 25, servings: 1, difficulty: 'Trung bình',
      tags: ['Việt Nam', 'Tăng cơ', 'Bữa sáng', 'Đặc sản'],
      instructions: '1. Chần bánh phở tươi qua nước sôi, xếp vào tô.\n2. Thịt thăn bò thái mỏng ướp tỏi gừng, tiêu, xào tái nhanh trên lửa lớn.\n3. Cho thịt bò lên tô bánh phở, rắc hành lá, chan nước dùng sôi sùng sục.\n4. Thưởng thức kèm chanh, ớt tươi và tương ớt Cholimex.',
      ingredients: [
        { name: 'Bánh phở tươi', amount: 200, unit: 'g' },
        { name: 'Thịt thăn bò nạc', amount: 150, unit: 'g' },
        { name: 'Hành lá tươi', amount: 30, unit: 'g' },
        { name: 'Hành tây', amount: 40, unit: 'g' },
        { name: 'Gừng tươi', amount: 10, unit: 'g' },
        { name: 'Tương ớt Cholimex', amount: 15, unit: 'g' }
      ]
    },
    {
      title: 'Phở ức gà Eat Clean',
      description: 'Phiên bản thanh nhẹ, giàu đạm tinh khiết từ ức gà luộc xé sợi, nước dùng ninh từ rau củ ngọt thanh tự nhiên.',
      kcal: 380.0, p: 42.0, c: 45.0, f: 3.5,
      time: 20, servings: 1, difficulty: 'Dễ',
      tags: ['Việt Nam', 'Eat Clean', 'Giảm mỡ', 'High Protein'],
      instructions: '1. Luộc ức gà với gừng và hành tím đến khi chín tới, vớt ra xé sợi.\n2. Chần bánh phở tươi xếp vào tô, thêm ức gà xé.\n3. Chan nước luộc gà đã nêm chút muối hồng và nước mắm truyền thống, rắc hành ngò thơm.',
      ingredients: [
        { name: 'Ức gà không da', amount: 160, unit: 'g' },
        { name: 'Bánh phở tươi', amount: 150, unit: 'g' },
        { name: 'Hành lá tươi', amount: 25, unit: 'g' },
        { name: 'Gừng tươi', amount: 10, unit: 'g' }
      ]
    },
    {
      title: 'Bún bò Huế chuẩn vị',
      description: 'Hương vị cay nồng đặc trưng xứ Huế với bắp bò hoa thơm mềm, bún sợi to, nước dùng sả ớt đậm đà.',
      kcal: 560.0, p: 44.0, c: 65.0, f: 14.0,
      time: 35, servings: 1, difficulty: 'Trung bình',
      tags: ['Việt Nam', 'Đặc sản', 'Tăng cơ', 'Bữa trưa'],
      instructions: '1. Luộc bắp bò chín mềm thái lát mỏng.\n2. Nấu nước dùng ninh từ sả băm, ớt sa tế và mắm ruốc loãng.\n3. Chần bún tươi cho vào tô, xếp bắp bò, rưới nước dùng nóng hổi, ăn kèm giá đỗ và rau thơm.',
      ingredients: [
        { name: 'Bún tươi', amount: 220, unit: 'g' },
        { name: 'Bắp bò hoa', amount: 160, unit: 'g' },
        { name: 'Sả băm', amount: 20, unit: 'g' },
        { name: 'Giá đỗ xanh', amount: 50, unit: 'g' },
        { name: 'Hành lá tươi', amount: 20, unit: 'g' }
      ]
    },
    {
      title: 'Cơm tấm sườn nướng bì chả',
      description: 'Món ăn biểu tượng Sài Gòn với miếng sườn non ướp mật ong nướng xém cạnh, chả trứng bùi bùi và cơm tấm dẻo thơm.',
      kcal: 680.0, p: 45.0, c: 75.0, f: 22.0,
      time: 30, servings: 1, difficulty: 'Trung bình',
      tags: ['Việt Nam', 'Đặc sản', 'Tăng cơ', 'Bữa trưa'],
      instructions: '1. Sườn non ướp nước mắm, mật ong, tỏi, dầu hào nướng than hoa hoặc nồi chiên không dầu.\n2. Hấp chả trứng thịt băm thơm nức.\n3. Xới cơm tấm ra đĩa, đặt sườn nướng, chả trứng, dưa leo, cà chua và chan mỡ hành.',
      ingredients: [
        { name: 'Cơm trắng', amount: 200, unit: 'g' },
        { name: 'Sườn non heo', amount: 180, unit: 'g' },
        { name: 'Trứng gà', amount: 1, unit: 'quả' },
        { name: 'Dưa leo (Dưa chuột)', amount: 60, unit: 'g' },
        { name: 'Cà chua chín', amount: 50, unit: 'g' },
        { name: 'Nước mắm cá cơm truyền thống', amount: 15, unit: 'ml' }
      ]
    },
    {
      title: 'Canh chua cá lóc miền Tây',
      description: 'Món canh giải nhiệt thanh mát, vị chua dịu từ cà chua và dứa, thịt cá lóc ngọt thịt, giàu đạm và ít chất béo.',
      kcal: 220.0, p: 32.0, c: 14.0, f: 4.0,
      time: 20, servings: 1, difficulty: 'Dễ',
      tags: ['Việt Nam', 'Bữa tối', 'Giảm mỡ', 'Low Fat'],
      instructions: '1. Cá lóc làm sạch cắt khúc, chần sơ qua nước sôi.\n2. Phi thơm tỏi, xào thơm cà chua, dứa cho ra màu đẹp rồi thêm nước sôi.\n3. Thả cá lóc vào đun nhỏ lửa 10 phút, nêm nước mắm và ớt tươi, rắc rau mùi tàu ngò gai.',
      ingredients: [
        { name: 'Cá lóc đồng (Cá quả)', amount: 180, unit: 'g' },
        { name: 'Cà chua chín', amount: 80, unit: 'g' },
        { name: 'Dứa tươi (Thơm)', amount: 60, unit: 'g' },
        { name: 'Giá đỗ xanh', amount: 40, unit: 'g' },
        { name: 'Nước mắm cá cơm truyền thống', amount: 15, unit: 'ml' }
      ]
    },
    {
      title: 'Bún chả Hà Nội nạc nướng',
      description: 'Thịt heo nạc vai băm viên và thịt thái lát nướng vàng thơm, thả vào bát nước chấm chua ngọt đu đủ giòn tan.',
      kcal: 520.0, p: 39.0, c: 64.0, f: 12.0,
      time: 30, servings: 1, difficulty: 'Trung bình',
      tags: ['Việt Nam', 'Đặc sản', 'Bữa trưa'],
      instructions: '1. Thịt nạc vai heo băm nhỏ viên tròn, ướp hành tỏi mắm tiêu nướng chín vàng.\n2. Pha nước chấm chua ngọt ấm nóng kèm đu đủ, cà rốt tỉa hoa.\n3. Ăn cùng đĩa bún tươi và rổ rau sống xà lách tươi ngon.',
      ingredients: [
        { name: 'Bún tươi', amount: 200, unit: 'g' },
        { name: 'Nạc vai heo', amount: 180, unit: 'g' },
        { name: 'Cà rốt', amount: 40, unit: 'g' },
        { name: 'Xà lách Romaine', amount: 60, unit: 'g' },
        { name: 'Nước mắm cá cơm truyền thống', amount: 20, unit: 'ml' }
      ]
    },
    {
      title: 'Thịt kho tàu trứng cút',
      description: 'Món ăn gia đình truyền thống đậm đà, thịt heo nạc hòa quyện vị bùi của trứng, thơm ngon đưa cơm.',
      kcal: 490.0, p: 38.0, c: 12.0, f: 32.0,
      time: 40, servings: 1, difficulty: 'Dễ',
      tags: ['Việt Nam', 'Bữa tối', 'Gia đình'],
      instructions: '1. Thịt heo thái con chì ướp hành tím băm, tiêu, nước mắm.\n2. Luộc trứng cút bóc vỏ.\n3. Kho thịt với nước dừa tươi nhỏ lửa đến khi mềm ngấm, thả trứng cút vào kho thêm 10 phút.',
      ingredients: [
        { name: 'Nạc vai heo', amount: 180, unit: 'g' },
        { name: 'Trứng cút', amount: 6, unit: 'quả' },
        { name: 'Nước mắm cá cơm truyền thống', amount: 20, unit: 'ml' },
        { name: 'Hành tím băm', amount: 15, unit: 'g' }
      ]
    },
    {
      title: 'Bò bít tết sốt tiêu đen măng tây',
      description: 'Thịt bò thăn mềm mọng nước chuẩn phong cách Âu, cung cấp hàm lượng sắt và protein đỉnh cao cho dân thể hình.',
      kcal: 430.0, p: 48.0, c: 8.0, f: 22.0,
      time: 15, servings: 1, difficulty: 'Dễ',
      tags: ['Quốc tế', 'Tăng cơ', 'High Protein', 'Keto'],
      instructions: '1. Thịt thăn bò rắc muối, tiêu đen 2 mặt.\n2. Đun nóng chảo với dầu ô liu, áp chảo mỗi mặt 2-3 phút cho đạt độ chín medium rare.\n3. Cho bơ lạt, tỏi và măng tây vào xào nhanh cạnh miếng bò.\n4. Rưới sốt tiêu đen nóng và thưởng thức.',
      ingredients: [
        { name: 'Thịt thăn bò nạc', amount: 200, unit: 'g' },
        { name: 'Măng tây', amount: 100, unit: 'g' },
        { name: 'Dầu ô liu Extra Virgin', amount: 10, unit: 'ml' },
        { name: 'Bơ lạt động vật (Butter)', amount: 10, unit: 'g' },
        { name: 'Tiêu đen xay', amount: 5, unit: 'g' }
      ]
    },
    {
      title: 'Cá hồi áp chảo sốt bơ chanh',
      description: 'Phi lê cá hồi giòn da béo ngậy, ngập tràn Omega-3 tốt cho tim mạch và phục hồi cơ bắp, thơm lừng vị bơ chanh.',
      kcal: 460.0, p: 38.0, c: 5.0, f: 32.0,
      time: 15, servings: 1, difficulty: 'Dễ',
      tags: ['Quốc tế', 'Eat Clean', 'Tăng cơ', 'Keto'],
      instructions: '1. Thấm khô phi lê cá hồi, rắc chút muối tiêu.\n2. Đặt mặt da cá hồi xuống chảo nóng áp chảo 4 phút đến khi vàng giòn, lật mặt chiên thêm 2 phút.\n3. Đun chảy bơ lạt vắt nước cốt chanh tươi, rưới đều lên miếng cá hồi.',
      ingredients: [
        { name: 'Phi lê cá hồi', amount: 180, unit: 'g' },
        { name: 'Bông cải xanh (Broccoli)', amount: 100, unit: 'g' },
        { name: 'Bơ lạt động vật (Butter)', amount: 15, unit: 'g' },
        { name: 'Dầu ô liu Extra Virgin', amount: 10, unit: 'ml' }
      ]
    },
    {
      title: 'Ức gà nướng mật ong sốt tiêu đen',
      description: 'Món ăn "quốc dân" của gymer được nâng tầm: ức gà mềm ngọt thấm đượm sốt mật ong cay nhẹ của tiêu đen, không hề bị khô bã.',
      kcal: 350.0, p: 52.0, c: 18.0, f: 6.0,
      time: 20, servings: 1, difficulty: 'Dễ',
      tags: ['Eat Clean', 'High Protein', 'Giảm mỡ', 'Tăng cơ'],
      instructions: '1. Khía nhẹ trên miếng ức gà để ngấm sốt.\n2. Trộn mật ong, dầu hào, tiêu đen, tỏi băm ướp 15 phút.\n3. Nướng bằng nồi chiên không dầu ở 180°C trong 15 phút, lật mặt phết thêm sốt nướng thêm 5 phút.',
      ingredients: [
        { name: 'Ức gà không da', amount: 200, unit: 'g' },
        { name: 'Mật ong nguyên chất', amount: 15, unit: 'ml' },
        { name: 'Dầu hào Maggi', amount: 10, unit: 'ml' },
        { name: 'Tiêu đen xay', amount: 5, unit: 'g' },
        { name: 'Bông cải xanh (Broccoli)', amount: 80, unit: 'g' }
      ]
    },
    {
      title: 'Cơm gạo lứt thịt bò xào ớt chuông',
      description: 'Bữa ăn cân bằng hoàn hảo macro: tinh bột chuyển hóa chậm từ gạo lứt, protein nạc dồi dào từ bò và vitamin C phong phú từ ớt chuông 3 màu.',
      kcal: 480.0, p: 44.0, c: 55.0, f: 9.0,
      time: 20, servings: 1, difficulty: 'Dễ',
      tags: ['Eat Clean', 'Tăng cơ', 'Bữa trưa', 'Cân bằng'],
      instructions: '1. Thịt bò thái lát mỏng ướp tỏi băm và chút dầu hào.\n2. Cắt quân cờ ớt chuông và hành tây.\n3. Phi tỏi, xào thịt bò tái trên lửa lớn rồi cho ớt chuông vào đảo đều 2 phút.\n4. Bày ra đĩa ăn kèm 1 chén cơm gạo lứt thơm dẻo.',
      ingredients: [
        { name: 'Thịt thăn bò nạc', amount: 160, unit: 'g' },
        { name: 'Gạo lứt', amount: 160, unit: 'g' },
        { name: 'Ớt chuông 3 màu', amount: 100, unit: 'g' },
        { name: 'Hành tây', amount: 50, unit: 'g' },
        { name: 'Dầu ô liu Extra Virgin', amount: 5, unit: 'ml' }
      ]
    },
    {
      title: 'Salad ức gà sốt mè rang Kewpie',
      description: 'Món salad giòn mát thanh nhiệt, ức gà xé mềm mọng hòa quyện vị thơm bùi béo ngậy của sốt mè rang và rau xà lách tươi.',
      kcal: 340.0, p: 46.0, c: 14.0, f: 12.0,
      time: 15, servings: 1, difficulty: 'Dễ',
      tags: ['Eat Clean', 'Giảm mỡ', 'Salad', 'Bữa tối'],
      instructions: '1. Luộc ức gà chín, xé miếng vừa ăn.\n2. Rửa sạch rau xà lách Romaine cắt khúc, cà chua bi bổ đôi, dưa leo thái lát.\n3. Cho rau và ức gà vào tô lớn, rưới sốt mè rang Kewpie lên trên và trộn đều nhẹ tay.',
      ingredients: [
        { name: 'Ức gà không da', amount: 180, unit: 'g' },
        { name: 'Xà lách Romaine', amount: 80, unit: 'g' },
        { name: 'Cà chua bi', amount: 60, unit: 'g' },
        { name: 'Dưa leo (Dưa chuột)', amount: 60, unit: 'g' },
        { name: 'Sốt mè rang Kewpie', amount: 25, unit: 'ml' }
      ]
    },
    {
      title: 'Yến mạch ngâm sữa chua Hy Lạp (Overnight Oats)',
      description: 'Bữa sáng nhanh gọn chuẩn Gymer phương Tây, chuẩn bị từ tối hôm trước để sáng hôm sau có ngay bữa ăn giàu năng lượng và lợi khuẩn.',
      kcal: 390.0, p: 26.0, c: 56.0, f: 7.0,
      time: 5, servings: 1, difficulty: 'Dễ',
      tags: ['Bữa sáng', 'Nhanh gọn', 'Eat Clean', 'High Protein'],
      instructions: '1. Cho yến mạch cán dẹt, sữa chua Hy Lạp và sữa chua không đường vào hũ thủy tinh.\n2. Thêm hạt chia và chút mật ong, khuấy đều rồi đậy nắp để ngăn mát tủ lạnh qua đêm.\n3. Sáng hôm sau lấy ra rải việt quất hoặc chuối thái lát lên mặt rồi thưởng thức.',
      ingredients: [
        { name: 'Yến mạch cán dẹt', amount: 60, unit: 'g' },
        { name: 'Sữa chua Hy Lạp không đường', amount: 120, unit: 'g' },
        { name: 'Hạt chia hữu cơ', amount: 10, unit: 'g' },
        { name: 'Chuối tiêu chín', amount: 60, unit: 'g' },
        { name: 'Mật ong nguyên chất', amount: 10, unit: 'ml' }
      ]
    },
    {
      title: 'Bún nưa xào thịt bò cần tây (Keto Siêu Giảm Mỡ)',
      description: 'Lựa chọn số 1 cho người đang siết cân (cutting) hoặc theo chế độ Keto: bún nưa gần như 0 calo kết hợp thịt bò giàu đạm và cần tây giải độc.',
      kcal: 260.0, p: 42.0, c: 6.0, f: 8.0,
      time: 15, servings: 1, difficulty: 'Dễ',
      tags: ['Keto', 'Giảm mỡ', 'Low Carb', 'Cutting'],
      instructions: '1. Rửa sạch bún nưa Konjac, chần qua nước sôi 2 phút rồi để ráo.\n2. Phi thơm tỏi, xào thịt bò chín tới rồi xúc ra đĩa riêng.\n3. Cho cần tây và ớt chuông vào xào giòn, sau đó đổ bún nưa và thịt bò vào đảo nhanh 2 phút với chút nước tương.',
      ingredients: [
        { name: 'Bún nưa Konjac', amount: 200, unit: 'g' },
        { name: 'Thịt thăn bò nạc', amount: 160, unit: 'g' },
        { name: 'Cần tây', amount: 80, unit: 'g' },
        { name: 'Nước tương đậu nành (Xì dầu)', amount: 15, unit: 'ml' }
      ]
    },
    {
      title: 'Bánh mì đen kẹp bơ sáp & trứng ốp la',
      description: 'Món ăn sáng thời thượng giàu chất béo tốt không bão hòa và năng lượng bền bỉ cho ngày tập luyện hăng say.',
      kcal: 370.0, p: 20.0, c: 38.0, f: 16.0,
      time: 10, servings: 1, difficulty: 'Dễ',
      tags: ['Bữa sáng', 'Nhanh gọn', 'Eat Clean'],
      instructions: '1. Nướng giòn 2 lát bánh mì đen nguyên cám.\n2. Áp chảo trứng gà kiểu ốp la lòng đào.\n3. Bơ sáp dầm nhuyễn với xíu muối tiêu, phết lên bánh mì rồi đặt trứng ốp la lên trên.',
      ingredients: [
        { name: 'Bánh mì đen nguyên cám', amount: 70, unit: 'g' },
        { name: 'Trứng gà', amount: 2, unit: 'quả' },
        { name: 'Quả bơ sáp (Avocado)', amount: 50, unit: 'g' },
        { name: 'Cà chua bi', amount: 40, unit: 'g' }
      ]
    },
    {
      title: 'Smoothie chuối bơ Whey Protein',
      description: 'Thức uống phục hồi sau tập (Post-workout) đỉnh cao, nạp ngay 40g protein tinh khiết và kali chống chuột rút cơ.',
      kcal: 360.0, p: 40.0, c: 35.0, f: 7.0,
      time: 5, servings: 1, difficulty: 'Dễ',
      tags: ['Sau tập', 'Đồ uống', 'Tăng cơ', 'Nhanh gọn'],
      instructions: '1. Cắt lát chuối tiêu đông lạnh và bơ sáp.\n2. Cho vào cối xay cùng 1 muỗng Whey Isolate và 200ml sữa tươi không đường.\n3. Xay mịn 30 giây rồi uống liền ngay sau buổi tập.',
      ingredients: [
        { name: 'Whey Protein Isolate', amount: 35, unit: 'g' },
        { name: 'Chuối tiêu chín', amount: 80, unit: 'g' },
        { name: 'Quả bơ sáp (Avocado)', amount: 40, unit: 'g' },
        { name: 'Sữa tươi không đường', amount: 150, unit: 'ml' }
      ]
    },
    {
      title: 'Cháo yến mạch ức gà xé nấm hương',
      description: 'Món cháo ấm bụng, dễ tiêu hóa, cung cấp nguồn năng lượng sạch lành mạnh cho bữa sáng hoặc bữa phụ tăng cân lành tính.',
      kcal: 340.0, p: 42.0, c: 38.0, f: 4.5,
      time: 15, servings: 1, difficulty: 'Dễ',
      tags: ['Bữa sáng', 'Eat Clean', 'Dễ tiêu hóa'],
      instructions: '1. Luộc ức gà xé nhỏ, giữ lại nước luộc gà.\n2. Đun sôi nước luộc gà, cho yến mạch cán và nấm hương vào nấu sôi 5 phút cho nhừ sánh.\n3. Thả ức gà xé vào quấy đều, nêm chút hạt tiêu và hành hoa thơm nức.',
      ingredients: [
        { name: 'Ức gà không da', amount: 150, unit: 'g' },
        { name: 'Yến mạch cán dẹt', amount: 50, unit: 'g' },
        { name: 'Nấm hương tươi', amount: 40, unit: 'g' },
        { name: 'Hành lá tươi', amount: 15, unit: 'g' }
      ]
    },
    {
      title: 'Đậu hũ sốt cà chua nạc heo băm',
      description: 'Món ăn gia đình quen thuộc, đậu hũ mềm ngậy sốt cà chua chua ngọt sánh mịn, kết hợp thịt nạc heo băm giàu đạm.',
      kcal: 360.0, p: 34.0, c: 14.0, f: 18.0,
      time: 20, servings: 1, difficulty: 'Dễ',
      tags: ['Việt Nam', 'Bữa tối', 'Gia đình'],
      instructions: '1. Đậu hũ trắng cắt miếng vuông vừa ăn.\n2. Phi thơm hành tím băm, xào thịt nạc heo băm và cà chua nát thành sốt sánh đỏ.\n3. Thả đậu hũ vào đun nhỏ lửa 8 phút cho ngấm đượm sốt, rắc hành lá tiêu cay.',
      ingredients: [
        { name: 'Đậu hũ trắng mềm', amount: 200, unit: 'g' },
        { name: 'Thịt heo nạc băm', amount: 120, unit: 'g' },
        { name: 'Cà chua chín', amount: 120, unit: 'g' },
        { name: 'Hành lá tươi', amount: 20, unit: 'g' }
      ]
    },
    {
      title: 'Mì Ý Spaghetti sốt bò băm cà chua (Bolognese)',
      description: 'Món ăn năng lượng kinh điển của các vận động viên thể thao trước ngày thi đấu (Carb loading), sợi mì dai giòn đậm đà sốt thịt bò.',
      kcal: 540.0, p: 44.0, c: 72.0, f: 9.0,
      time: 25, servings: 1, difficulty: 'Dễ',
      tags: ['Quốc tế', 'Tăng cơ', 'Carb Loading'],
      instructions: '1. Luộc mì Ý trong nước sôi có chút muối khoảng 8-9 phút, vớt ra xóc chút dầu ô liu.\n2. Xào thịt bò xay với hành tây, tỏi băm và tương cà sốt cà chua.\n3. Đổ sốt bò băm lên đĩa mì, rắc chút phô mai Parmesan hoặc tiêu thơm.',
      ingredients: [
        { name: 'Mì Ý Spaghetti (khô)', amount: 90, unit: 'g' },
        { name: 'Thịt bò xay nạc (Ground beef)', amount: 160, unit: 'g' },
        { name: 'Cà chua chín', amount: 100, unit: 'g' },
        { name: 'Hành tây', amount: 40, unit: 'g' },
        { name: 'Dầu ô liu Extra Virgin', amount: 10, unit: 'ml' }
      ]
    },
    {
      title: 'Canh rong biển đậu non thịt bò',
      description: 'Món canh Hàn Quốc thanh mát, giàu i-ốt và khoáng chất, thịt bò mềm ngọt kết hợp đậu hũ non mát lành.',
      kcal: 230.0, p: 32.0, c: 10.0, f: 6.5,
      time: 15, servings: 1, difficulty: 'Dễ',
      tags: ['Quốc tế', 'Giảm mỡ', 'Thanh lọc', 'Bữa tối'],
      instructions: '1. Ngâm nở rong biển khô Wakame, rửa sạch cắt khúc.\n2. Xào thịt bò với dầu mè và tỏi băm thơm nức.\n3. Thêm nước sôi đun 5 phút, thả đậu hũ non cắt quân cờ và rong biển vào nấu sôi lại, nêm nước tương.',
      ingredients: [
        { name: 'Thịt thăn bò nạc', amount: 120, unit: 'g' },
        { name: 'Đậu hũ trắng mềm', amount: 150, unit: 'g' },
        { name: 'Rong biển khô Wakame', amount: 15, unit: 'g' },
        { name: 'Dầu mè thơm', amount: 5, unit: 'ml' }
      ]
    }
  ];

  console.log(`Inserting/Updating ${recipes.length} recipes...`);
  for (const r of recipes) {
    const res = await pool.query(`
      INSERT INTO recipes (title, description, kcal, protein_g, carbs_g, fat_g, cooking_time_min, servings, difficulty, tags, instructions)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (title) DO UPDATE SET
        description = EXCLUDED.description,
        kcal = EXCLUDED.kcal,
        protein_g = EXCLUDED.protein_g,
        carbs_g = EXCLUDED.carbs_g,
        fat_g = EXCLUDED.fat_g,
        cooking_time_min = EXCLUDED.cooking_time_min,
        servings = EXCLUDED.servings,
        difficulty = EXCLUDED.difficulty,
        tags = EXCLUDED.tags,
        instructions = EXCLUDED.instructions
      RETURNING id
    `, [r.title, r.description, r.kcal, r.p, r.c, r.f, r.time, r.servings, r.difficulty, r.tags, r.instructions]);

    const recipeId = res.rows[0].id;

    // Delete existing recipe_ingredients for clean sync
    await pool.query('DELETE FROM recipe_ingredients WHERE recipe_id = $1', [recipeId]);

    // Insert recipe_ingredients
    for (const item of r.ingredients) {
      // Find ingredient id
      const ingRes = await pool.query('SELECT id FROM ingredients WHERE name = $1', [item.name]);
      const ingId = ingRes.rows.length ? ingRes.rows[0].id : null;

      await pool.query(`
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, ingredient_name, amount, unit)
        VALUES ($1, $2, $3, $4, $5)
      `, [recipeId, ingId, item.name, item.amount, item.unit]);
    }
  }

  const finalIng = await pool.query('SELECT COUNT(*) FROM ingredients');
  const finalRec = await pool.query('SELECT COUNT(*) FROM recipes');
  const finalLink = await pool.query('SELECT COUNT(*) FROM recipe_ingredients');

  console.log(`=== DONE! TOTAL INGREDIENTS: ${finalIng.rows[0].count}, RECIPES: ${finalRec.rows[0].count}, LINKS: ${finalLink.rows[0].count} ===`);
  await pool.end();
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});

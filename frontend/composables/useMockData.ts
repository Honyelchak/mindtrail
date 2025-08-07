/**
 * 模拟数据生成器
 * 为开发和演示提供丰富的模拟数据
 */

import type { ContentLocation, LocationRevisit } from './useLocation'
import type { Moment, Article, GalleryItem, TimelineItem } from '~/types'

// 北京市各个区域的坐标点
const BEIJING_LOCATIONS = [
  { name: '天安门广场', lat: 39.9042, lng: 116.4074, district: '东城区' },
  { name: '故宫博物院', lat: 39.9163, lng: 116.3972, district: '东城区' },
  { name: '颐和园', lat: 39.9999, lng: 116.2755, district: '海淀区' },
  { name: '圆明园', lat: 40.0084, lng: 116.2972, district: '海淀区' },
  { name: '北海公园', lat: 39.9252, lng: 116.3883, district: '西城区' },
  { name: '景山公园', lat: 39.9289, lng: 116.3947, district: '西城区' },
  { name: '天坛公园', lat: 39.8822, lng: 116.4066, district: '东城区' },
  { name: '雍和宫', lat: 39.9475, lng: 116.4186, district: '东城区' },
  { name: '什刹海', lat: 39.9389, lng: 116.3883, district: '西城区' },
  { name: '南锣鼓巷', lat: 39.9361, lng: 116.4019, district: '东城区' },
  { name: '798艺术区', lat: 39.9847, lng: 116.4972, district: '朝阳区' },
  { name: '三里屯', lat: 39.9364, lng: 116.4553, district: '朝阳区' },
  { name: '王府井', lat: 39.9097, lng: 116.4158, district: '东城区' },
  { name: '西单', lat: 39.9069, lng: 116.3747, district: '西城区' },
  { name: '鸟巢', lat: 39.9928, lng: 116.3975, district: '朝阳区' },
  { name: '水立方', lat: 39.9919, lng: 116.3914, district: '朝阳区' },
  { name: '香山公园', lat: 39.9958, lng: 116.1889, district: '海淀区' },
  { name: '十三陵', lat: 40.2197, lng: 116.2306, district: '昌平区' },
  { name: '八达岭长城', lat: 40.3594, lng: 116.0144, district: '延庆区' },
  { name: '慕田峪长城', lat: 40.4319, lng: 116.5658, district: '怀柔区' }
]

// 心情类型
const MOODS = ['happy', 'excited', 'peaceful', 'thoughtful', 'grateful', 'nostalgic', 'inspired', 'relaxed', 'curious', 'content']

// 标签库
const TAGS = [
  '旅行', '美食', '摄影', '读书', '电影', '音乐', '运动', '健身', '瑜伽', '跑步',
  '咖啡', '下午茶', '朋友聚会', '家庭时光', '工作', '学习', '思考', '感悟', '回忆',
  '春天', '夏天', '秋天', '冬天', '阳光', '雨天', '雪天', '夜晚', '日出', '日落',
  '北京', '胡同', '公园', '博物馆', '艺术', '文化', '历史', '建筑', '风景', '城市'
]

// 生成随机日期（最近一年内）
const getRandomDate = (daysAgo: number = 365): string => {
  const now = new Date()
  const randomDays = Math.floor(Math.random() * daysAgo)
  const date = new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000)
  return date.toISOString()
}

// 生成随机标签
const getRandomTags = (count: number = 3): string[] => {
  const shuffled = [...TAGS].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// 生成随机图片URL
const getRandomImage = (width: number = 800, height: number = 600): string => {
  const topics = ['nature', 'city', 'food', 'people', 'architecture', 'travel', 'art']
  const topic = topics[Math.floor(Math.random() * topics.length)]
  return `https://picsum.photos/${width}/${height}?random=${Math.random()}&topic=${topic}`
}

export const useMockData = () => {
  // 生成模拟说说数据
  const generateMockMoments = (count: number = 20): Moment[] => {
    const moments: Moment[] = []
    
    for (let i = 0; i < count; i++) {
      const location = BEIJING_LOCATIONS[Math.floor(Math.random() * BEIJING_LOCATIONS.length)]
      const imageCount = Math.floor(Math.random() * 5) // 0-4张图片
      const images = Array.from({ length: imageCount }, () => getRandomImage(400, 300))
      
      const contents = [
        `今天在${location.name}度过了美好的时光，感受到了这座城市的独特魅力。`,
        `${location.name}的风景真的很美，每次来都有不同的感受。`,
        `和朋友一起在${location.name}漫步，聊着天南海北的话题。`,
        `${location.name}的历史底蕴深厚，让人不禁思考时光的流逝。`,
        `在${location.name}看到了最美的日落，心情格外舒畅。`,
        `${location.name}总是能给我带来灵感，今天又有了新的想法。`,
        `第一次来${location.name}，被这里的氛围深深吸引。`,
        `${location.name}的秋色正浓，满眼都是金黄的叶子。`
      ]
      
      moments.push({
        id: `moment_${i + 1}`,
        content: contents[Math.floor(Math.random() * contents.length)],
        author: {
          id: 'user_1',
          name: '旅行者',
          avatar: getRandomImage(100, 100)
        },
        images,
        location: {
          name: location.name,
          latitude: location.lat,
          longitude: location.lng,
          address: `${location.district}${location.name}`
        },
        mood: MOODS[Math.floor(Math.random() * MOODS.length)],
        tags: getRandomTags(Math.floor(Math.random() * 4) + 1),
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 20),
        createdAt: getRandomDate(),
        updatedAt: getRandomDate()
      })
    }
    
    return moments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // 生成模拟文章数据
  const generateMockArticles = (count: number = 15): Article[] => {
    const articles: Article[] = []
    
    const titles = [
      '北京胡同里的时光印记',
      '故宫博物院的文化瑰宝',
      '颐和园四季之美',
      '798艺术区的创意之旅',
      '什刹海的夜色如画',
      '天坛公园的建筑奇迹',
      '香山红叶的诗意秋天',
      '长城上的历史回响',
      '北海公园的宁静时光',
      '南锣鼓巷的文艺气息',
      '三里屯的都市风情',
      '景山公园的登高望远',
      '雍和宫的禅意人生',
      '王府井的繁华记忆',
      '鸟巢水立方的奥运情怀'
    ]
    
    for (let i = 0; i < count; i++) {
      const location = BEIJING_LOCATIONS[Math.floor(Math.random() * BEIJING_LOCATIONS.length)]
      const title = titles[i] || `${location.name}游记`
      
      articles.push({
        id: `article_${i + 1}`,
        title,
        excerpt: `这是一篇关于${location.name}的深度游记，记录了在这里的所见所闻所感...`,
        content: `# ${title}\n\n今天来到了${location.name}，这里给我留下了深刻的印象...\n\n## 历史文化\n\n${location.name}有着悠久的历史...\n\n## 个人感受\n\n在这里，我感受到了...`,
        coverImage: getRandomImage(800, 400),
        author: {
          id: 'user_1',
          name: '旅行者',
          avatar: getRandomImage(100, 100)
        },
        location: {
          name: location.name,
          latitude: location.lat,
          longitude: location.lng,
          address: `${location.district}${location.name}`
        },
        tags: getRandomTags(Math.floor(Math.random() * 5) + 2),
        readingTime: Math.floor(Math.random() * 10) + 3,
        likes: Math.floor(Math.random() * 200),
        comments: Math.floor(Math.random() * 50),
        views: Math.floor(Math.random() * 1000) + 100,
        status: 'published',
        createdAt: getRandomDate(),
        updatedAt: getRandomDate(),
        publishedAt: getRandomDate()
      })
    }
    
    return articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // 生成模拟相册数据
  const generateMockGalleries = (count: number = 10): GalleryItem[] => {
    const galleries: GalleryItem[] = []
    
    const titles = [
      '北京春日踏青记',
      '故宫雪景摄影集',
      '颐和园荷花盛开',
      '798艺术展览',
      '什刹海夜景',
      '天坛建筑细节',
      '香山红叶季',
      '长城日出',
      '北海公园四季',
      '胡同里的生活'
    ]
    
    for (let i = 0; i < count; i++) {
      const location = BEIJING_LOCATIONS[Math.floor(Math.random() * BEIJING_LOCATIONS.length)]
      const imageCount = Math.floor(Math.random() * 15) + 5 // 5-19张图片
      const images = Array.from({ length: imageCount }, (_, idx) => ({
        id: `img_${i}_${idx}`,
        url: getRandomImage(800, 600),
        thumbnail: getRandomImage(200, 150),
        title: `${location.name}照片${idx + 1}`,
        description: `在${location.name}拍摄的精彩瞬间`,
        takenAt: getRandomDate()
      }))
      
      galleries.push({
        id: `gallery_${i + 1}`,
        title: titles[i] || `${location.name}摄影集`,
        description: `记录在${location.name}的美好时光，每一张照片都承载着特殊的回忆。`,
        coverImage: images[0].url,
        images,
        location: {
          name: location.name,
          latitude: location.lat,
          longitude: location.lng,
          address: `${location.district}${location.name}`
        },
        tags: getRandomTags(Math.floor(Math.random() * 4) + 2),
        likes: Math.floor(Math.random() * 150),
        comments: Math.floor(Math.random() * 30),
        views: Math.floor(Math.random() * 500) + 50,
        createdAt: getRandomDate(),
        updatedAt: getRandomDate()
      })
    }
    
    return galleries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // 生成模拟位置数据
  const generateMockLocations = (count: number = 30): ContentLocation[] => {
    const locations: ContentLocation[] = []
    const contentTypes = ['moment', 'article', 'gallery', 'video'] as const
    
    for (let i = 0; i < count; i++) {
      const location = BEIJING_LOCATIONS[Math.floor(Math.random() * BEIJING_LOCATIONS.length)]
      const contentType = contentTypes[Math.floor(Math.random() * contentTypes.length)]
      
      // 生成回访记录
      const revisitCount = Math.floor(Math.random() * 3)
      const revisits: LocationRevisit[] = Array.from({ length: revisitCount }, (_, idx) => ({
        id: `revisit_${i}_${idx}`,
        visitDate: getRandomDate(30),
        reflection: `第${idx + 1}次回访${location.name}，又有了新的感受...`,
        mood: MOODS[Math.floor(Math.random() * MOODS.length)],
        photos: [getRandomImage(400, 300)],
        rating: Math.floor(Math.random() * 5) + 1
      }))
      
      locations.push({
        id: `location_${i + 1}`,
        contentId: `${contentType}_${i + 1}`,
        contentType,
        title: `${location.name}的${contentType === 'moment' ? '说说' : contentType === 'article' ? '文章' : contentType === 'gallery' ? '相册' : '视频'}`,
        preview: `在${location.name}创作的内容预览...`,
        thumbnail: getRandomImage(200, 150),
        latitude: location.lat + (Math.random() - 0.5) * 0.01, // 添加小范围随机偏移
        longitude: location.lng + (Math.random() - 0.5) * 0.01,
        accuracy: Math.floor(Math.random() * 50) + 10,
        address: `${location.district}${location.name}`,
        city: '北京市',
        country: '中国',
        timestamp: getRandomDate(),
        createdAt: getRandomDate(),
        revisits
      })
    }
    
    return locations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // 生成时间线数据
  const generateMockTimeline = (): TimelineItem[] => {
    const moments = generateMockMoments(10)
    const articles = generateMockArticles(8)
    const galleries = generateMockGalleries(5)
    
    const timeline: TimelineItem[] = [
      ...moments.map(moment => ({
        id: moment.id,
        type: 'moment' as const,
        title: moment.content.slice(0, 50) + '...',
        content: moment.content,
        images: moment.images,
        location: moment.location,
        mood: moment.mood,
        tags: moment.tags,
        likes: moment.likes,
        comments: moment.comments,
        createdAt: moment.createdAt
      })),
      ...articles.map(article => ({
        id: article.id,
        type: 'article' as const,
        title: article.title,
        content: article.excerpt,
        excerpt: article.excerpt,
        images: article.coverImage ? [article.coverImage] : [],
        location: article.location,
        tags: article.tags,
        likes: article.likes,
        comments: article.comments,
        readingTime: article.readingTime,
        createdAt: article.createdAt
      })),
      ...galleries.map(gallery => ({
        id: gallery.id,
        type: 'gallery' as const,
        title: gallery.title,
        content: gallery.description,
        images: gallery.images.slice(0, 3).map(img => img.url),
        location: gallery.location,
        tags: gallery.tags,
        likes: gallery.likes,
        comments: gallery.comments,
        createdAt: gallery.createdAt
      }))
    ]
    
    return timeline.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  return {
    generateMockMoments,
    generateMockArticles,
    generateMockGalleries,
    generateMockLocations,
    generateMockTimeline,
    BEIJING_LOCATIONS,
    MOODS,
    TAGS
  }
}

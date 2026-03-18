
# Crossword Clue 数据集调研报告

## 📊 找到的优质数据集

### 1. **NYT Crossword Clues &amp; Answers (1993-2021)** ⭐⭐⭐⭐⭐
**位置：** https://www.kaggle.com/datasets/darinhawley/new-york-times-crossword-clues-answers-19932021

**特点：**
- ✅ **350,000+ 条记录**（NYT 28年数据）
- ✅ 权威来源（纽约时报）
- ✅ 包含日期、来源报纸信息
- ✅ CSV 格式，易于导入

**这是我们的首选！** 质量最高，数据量最大。

---

### 2. **xword_benchmark Dataset** ⭐⭐⭐⭐
**位置：** https://github.com/text-machine-lab/xword_benchmark

**特点：**
- ✅ ACL 2022 论文发布的学术数据集
- ✅ 下载链接：Dropbox / Google Drive / Mediafire
- ✅ 包含 train/val/test 分割
- ✅ 多报纸来源（不只是 NYT）

**数据量：** 未明确说明，但应该在 100,000+ 级别

---

### 3. **MsFit Crossword Dataset** ⭐⭐⭐
**位置：** https://github.com/nzfeng/crossword-dataset

**特点：**
- ✅ 人工精选 42,000 词条
- ✅ 美式英语，适合填字游戏
- ✅ 包含短语、习语
- ⚠️ 只有答案，没有 clue（需要自己配对）

**适合：** 作为答案词库补充

---

### 4. **Kaggle Crossword Solver Competition** ⭐⭐⭐
**位置：** https://www.kaggle.com/c/crossword-solver/data

**特点：**
- ✅ train.csv + nyt.csv（测试集）
- ✅ 2021-2022 NYT 数据
- ⚠️ 竞赛数据，可能需要注册

---

### 5. **Cryptic Wordplay Dataset** ⭐⭐
**位置：** https://github.com/mdda/cryptic-wordplay

**特点：**
- ✅ 专门针对 cryptic crossword（英式）
- ⚠️ 不是我们要的美式风格

**适合：** 未来扩展

---

## 🎯 数据获取策略

### 优先级排序

**Phase 1：立即获取（本周）**
1. NYT Kaggle Dataset（350,000 条）- 主要数据源
2. xword_benchmark（多来源）- 补充数据

**Phase 2：下周**
3. MsFit Dataset（42,000 答案词库）
4. 用户提交功能（获取新数据）

**Phase 3：长期**
5. 爬虫（从 crosswordtracker.com 等站点补充）
6. 社区贡献

---

## 💾 数据库导入计划

### 数据清洗步骤
1. **去重** - 同一 clue 可能出现多次
2. **标准化** - 统一大小写、标点
3. **质量过滤** - 移除低质量条目
4. **词长计算** - 预计算 answer 长度
5. **难度评分** - 基于出现频率估算

### Schema 映射
```csv
NYT 数据集列 → 数据库表
---------------------------
Clue → clue_text
Answer → answer
Date → source_date
Word Count → (计算 length)
... → difficulty (基于频率)
```

---

## 📝 内容构建计划

### 初始目标
- **第 1 周**：导入 350,000 NYT 数据
- **第 2 周**：补充 xword_benchmark（+100,000）
- **第 3 周**：去重、清洗、索引优化
- **第 4 周**：450,000+ 高质量词条上线

### "Stupidity" 相关专项
手动整理 200+ 词条，包括：
- stupidity（主关键词）
- folly, idiocy, fatuity, inanity（同义词）
- dullness, nonsense, absurdity（相关词）
- 以及它们的各种长度变体

---

## 🔗 下载链接汇总

| 数据集 | 状态 | 链接 |
|--------|------|------|
| **NYT 1993-2021** | ⏳ 需要下载 | https://www.kaggle.com/datasets/darinhawley/new-york-times-crossword-clues-answers-19932021 |
| **xword_benchmark** | ⏳ 需要下载 | https://github.com/text-machine-lab/xword_benchmark |
| **MsFit 42k** | ✅ 可克隆 | https://github.com/nzfeng/crossword-dataset |

---

## 🚀 下一步行动

### 立即执行
1. 下载 NYT Kaggle 数据集
2. 克隆 xword_benchmark 数据集
3. 设计数据清洗脚本
4. 测试导入 1,000 条数据

### 需要准备
- Kaggle 账号（下载 NYT 数据）
- 足够的磁盘空间（~100MB 应该够）
- PostgreSQL 数据库初始化

---

*报告日期：2026-03-18*


---
title: 페이지별 리소스 분리(Code Splitting, Tree Shaking)
date: 2022-09-03 02:09:90
category: 최적화
thumbnail: { thumbnailSrc }
draft: true
---

### Code Splitting

```jsx
import { lazy, Suspense } from 'react'

const Search = lazy(() => import('./pages/Search/Search'))

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
        </Routes>
        <Footer />
      </Suspense>
    </Router>
  )
}

export default App
```

### Tree Shaking

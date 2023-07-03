## 설치 이슈 해결

### 설치 시 `ERR! sharp Prebuilt libvips 8.10.5 binaries are not yet available for darwin-arm64v8` 에러 발생 시 참고

<https://github.com/lovell/sharp/issues/2678>

node를 arm64 대신 x64로 설치해야 해결되는 문제이다. 아래와 같은 명령어를 입력하면 arm64가 출력될 것이다.

```bash
node -p 'process.arch'

// arm64
```

1. 터미널에서 `arch -x86_64 zsh` 입력하여 터미널 아키텍처 버전 변경
2. 프로젝트에서 사용하려는 노드 버전 제거 후 재설치 `nvm uninstall 14 && nvm install 14`
3. `node -p 'process.arch'` 로 다시 확인하면 x64 출력됨
4. 패키지 재설치 `rm -rf node_modules && npm install`

-

# 지뢰찾기

![스크린샷 2022-04-11 오전 7 38 43](https://user-images.githubusercontent.com/70994795/162643059-ec708b9f-b2c4-4096-a774-2934cb245049.png)
![스크린샷 2022-04-11 오전 7 39 53](https://user-images.githubusercontent.com/70994795/162643063-0a6ecc11-6e44-44ef-a54b-588005af69bd.png)


### 설치 및 시작
> `git clone https://github.com/mementomoriCarpediem/mine-sweeper.git` &&
`cd mine-sweeper` &&
`yarn install`

### 적용 기술s
> React, Typescript, redux-toolkit, styled-components

### 작동 방법
- 프로젝트 시작
  - `yarn start`

- 상단 메뉴의 "난이도 선택" or 게임 세팅 값 수동 입력("가로길이, 세로길이,지뢰 수)
  - "난이도 선택"을 통해 난이도 선택 시에는 미리 세팅된 게임 세팅 값들이 자동 입력

- 게임 시작 
  - "Start" 버튼 클릭
  - 게임 시작과 동시에, 설정된 사이즈에 대한 게임판이 생성되며, 우측 "소요시간" 카운트 시작 (소요시간은 30초로 defualt 설정되어 있음)

- 게임 진행
  - 원하는 셀 클릭 시, 인근 셀에 지뢰가 탐지 될때까지는 자동 오픈
  - 첫 번째 클릭 셀이 지뢰인 경우는, 자동으로 해당 지뢰 위치를 아래 row로 이동시켜, 첫 번째에는 항상 지뢰가 없도록 설정

- 게임 종료
  - 설정된 시간(30초)가 종료되거나, 2번째 클릭 이상에서 지뢰를 선택한 경우 게임 종료(실패)
  - 남은 셀이 모두 지로인 경우, 유저 승리 alert 메시지 (성공)

- 게임 재시작
  - 새로고침 클릭




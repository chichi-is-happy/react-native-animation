module.exports = {
  root: true,
  extends: ['@react-native-community', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'no-var': 'warn', // var 금지
    'no-multiple-empty-lines': 'warn', // 여러 줄 공백 금지
    eqeqeq: 'warn', // 일치 연산자 사용 필수
    'no-unused-vars': 'warn', // 사용하지 않는 변수 금지
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/destructuring-assignment': 'warn', // state, prop 등에 구조분해 할당 적용
    'react/jsx-pascal-case': 'warn', // 컴포넌트 이름 PascalCase
    'react/no-direct-mutation-state': 'error', // state 직접 수정 금지
    // 'react/jsx-no-useless-fragment': 'warn', // 불필요한 fragment 태그 금지
    'react/no-unused-state': 'error', // 사용하지 않는 state 경고
    'react/jsx-key': 'warn', // 반복문으로 생성하는 요소에 key 강제
    'react/self-closing-comp': 'warn', // 셀프 클로징 태그 사용가능하면 적용
    'react/jsx-curly-brace-presence': 'warn', // jsx내 불필요한 중괄호 금지
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'react-hooks/exhaustive-deps': 'off', // react hook 의존성 배열 경고 끄기
    'no-bitwise': 0, // 비트연산자 사용 가능
  },
  parser: '@babel/eslint-parser',
  plugins: ['jest'],
};

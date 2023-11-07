import { Console, Random } from '@woowacourse/mission-utils';
import Lotto from './Lotto.js';
import LottoError from './error/LottoError.js';

class GuessLotto {
  #guessNumbers = [];

  #guessBonus = null;

  #lottoPieces = 0;

  #lottoNumbers = [];

  getGuessNumbers() {
    return this.#guessNumbers;
  }

  setGuessNumbers(numbers) {
    this.#guessNumbers = numbers;
  }

  getGuessBonus() {
    return this.#guessBonus;
  }

  setGuessBonus(bonus) {
    this.#guessBonus = bonus;
  }

  getLottoPieces() {
    return this.#lottoPieces;
  }

  setLottoPieces(pieces) {
    this.#lottoPieces = pieces;
  }

  getLottoNumbers() {
    return this.#lottoNumbers;
  }

  setLottoNumbers(numbers) {
    this.#lottoNumbers = numbers;
  }

  async inputLottoNumber() {
    try {
      const personalLottoNumber =
        await Console.readLineAsync('당첨 번호를 입력해 주세요.\n');

      this.#guessNumbers = personalLottoNumber.split(',');
      const lotto = new Lotto(this.#guessNumbers);

      return this.#guessNumbers;
    } catch (error) {
      Console.print(error.message);
      return this.inputLottoNumber();
    }
  }

  async inputBonusNumber() {
    try {
      this.#guessBonus = await Console.readLineAsync(
        '\n보너스 번호를 입력해 주세요.\n',
      );
      this.validateBonusNumber(this.#guessBonus);
      return this.#guessBonus;
    } catch (error) {
      Console.print(error.message);
      return this.inputBonusNumber();
    }
  }

  validateBonusNumber(number) {
    if (Number.isNaN(+number) || +number < 1 || +number > 45) {
      throw new LottoError(LottoError.ERROR_MSG.bonus);
    }

    if (this.#guessNumbers.includes(number) || !Number.isInteger(+number)) {
      throw new LottoError(LottoError.ERROR_MSG.bonus);
    }
  }

  async buyLotto() {
    try {
      const inputMoney =
        await Console.readLineAsync('구입 금액을 입력해 주세요.\n');
      if (Number.isNaN(+inputMoney) || inputMoney.trim() === '') {
        throw new Error('[ERROR] 구입 금액이 잘못되었습니다.\n');
      }
      this.#validatePurchaseAmount(+inputMoney);
      this.#lottoPieces = inputMoney / 1000;
      return this.#lottoPieces;
    } catch (error) {
      Console.print(error.message);
      return this.buyLotto();
    }
  }

  #validatePurchaseAmount(amount) {
    if (amount > 100000) {
      throw new LottoError(LottoError.ERROR_MSG.moneyMax);
    }

    if (amount < 1000 || amount % 1000 !== 0) {
      throw new LottoError(LottoError.ERROR_MSG.moneyAmount);
    }
  }

  generateLottoNumber() {
    const lottoNumber = Random.pickUniqueNumbersInRange(1, 45, 6).sort(
      (a, b) => a - b,
    );
    this.#lottoNumbers.push(lottoNumber);
    return `[${lottoNumber.join(', ')}]`;
  }
}

export default GuessLotto;

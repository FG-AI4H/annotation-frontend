const code = {
  4: { territoryCode: '1' },
  5: { territoryCode: '2' },
};

export default function request(url) {
  return new Promise((resolve, reject) => {
    const territoryCode = parseInt(url.substr('/code/'.length), 10);
    process.nextTick(() =>
      code[territoryCode]
        ? resolve(code[territoryCode])
        : reject({
            error: `Territory ${territoryCode} not found.`,
          }),
    );
  });
}

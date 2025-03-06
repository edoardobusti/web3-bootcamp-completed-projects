📑 Assignments M5
Assignment: Real-Time Blockchain Analytics Dashboard

Your task is to build a front-end project that visualizes key blockchain metrics using real-time data from the Ethereum network. You can use any front-end framework of your choice, but we encourage you to use a React-based framework such as Next.js.

Project Requirements

1. Initial Setup:
   – When the page first loads, the dashboard should display data from the most recent 10 blocks.
   – The graphs should update in real-time with each new block produced, always displaying data from the latest 10 blocks.

2. Real-Time Graphs:
   – First Chart:
   – This chart should track the total transfer volume of an arbitrary ERC20 token that you provide.
   – For each block, plot the total volume of token transfers (if any).
   – Test your solution with popular ERC20 tokens to ensure sufficient data.
   – Second Chart:
   – This chart should display the BASEFEE of each block.
   – The X-axis should represent the block number, and the Y-axis should represent the BASEFEE.
   – If you are unsure about what BASEFEE is, refer to the Gas Savings EIP 1559 video.
   – Third Chart:
   – This chart should plot the ratio of gasUsed over gasLimit, displayed as a percentage.
   – Observe the relationship between this ratio and the BASEFEE.

3. Real-Time Block Listening:
   – Your dashboard should actively listen for new blocks being produced.
   – As each new block arrives, the graphs should shift to display the most recent 10 blocks, maintaining a real-time view of the data.

Testing:
– Ensure your dashboard performs smoothly, updating seamlessly with new block data.
– Test with popular ERC20 tokens to validate transfer volume data.

Good luck! This project will deepen your understanding of real-time blockchain data handling and front-end visualization techniques.

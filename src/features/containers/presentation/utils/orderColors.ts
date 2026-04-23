// Created by Luis

// 5-color palette that cycles when there are more than 5 orders in one container
export const ORDER_COLORS = [
    '#32cd32', // lime green
    '#0F6E56', // teal
    '#993C1D', // coral
    '#185FA5', // blue
    '#3B6D11', // dark green
];

export function colorForOrder(index: number): string {
    return ORDER_COLORS[index % ORDER_COLORS.length];
}

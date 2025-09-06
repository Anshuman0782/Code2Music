import React, { useState } from "react";
import Navbar from "../Layout/Navbar";

const bubbleSortExamples = {
  C: `#include <stdio.h>
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++)
        for (int j = 0; j < n-i-1; j++)
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
}
int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr)/sizeof(arr[0]);
    bubbleSort(arr, n);
    for (int i = 0; i < n; i++)
        printf("%d ", arr[i]);
    return 0;
}`,
  CPP: `#include <iostream>
using namespace std;
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++)
        for (int j = 0; j < n-i-1; j++)
            if (arr[j] > arr[j+1])
                swap(arr[j], arr[j+1]);
}
int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr)/sizeof(arr[0]);
    bubbleSort(arr, n);
    for (int i = 0; i < n; i++)
        cout << arr[i] << " ";
    return 0;
}`,
  JAVA: `public class BubbleSort {
    static void bubbleSort(int arr[]) {
        int n = arr.length;
        for (int i = 0; i < n-1; i++)
            for (int j = 0; j < n-i-1; j++)
                if (arr[j] > arr[j+1]) {
                    int temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
    }
    public static void main(String args[]) {
        int arr[] = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(arr);
        for (int num : arr)
            System.out.print(num + " ");
    }
}`,
  JAVASCRIPT: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n-1; i++) {
    for (let j = 0; j < n-i-1; j++) {
      if (arr[j] > arr[j+1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
      }
    }
  }
  return arr;
}
console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));`,
  PYTHON: `def bubbleSort(arr):
    n = len(arr)
    for i in range(n-1):
        for j in range(n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]

arr = [64, 34, 25, 12, 22, 11, 90]
bubbleSort(arr)
print(arr)`,
  GO: `package main
import "fmt"

func bubbleSort(arr []int) {
    n := len(arr)
    for i := 0; i < n-1; i++ {
        for j := 0; j < n-i-1; j++ {
            if arr[j] > arr[j+1] {
                arr[j], arr[j+1] = arr[j+1], arr[j]
            }
        }
    }
}

func main() {
    arr := []int{64, 34, 25, 12, 22, 11, 90}
    bubbleSort(arr)
    fmt.Println(arr)
}`,
  PHP: `<?php
function bubbleSort(&$arr) {
    $n = count($arr);
    for ($i = 0; $i < $n-1; $i++) {
        for ($j = 0; $j < $n-$i-1; $j++) {
            if ($arr[$j] > $arr[$j+1]) {
                $temp = $arr[$j];
                $arr[$j] = $arr[$j+1];
                $arr[$j+1] = $temp;
            }
        }
    }
}
$arr = [64, 34, 25, 12, 22, 11, 90];
bubbleSort($arr);
print_r($arr);
?>`,
  SHELL: `arr=(64 34 25 12 22 11 90)
n=\${#arr[@]}
for ((i=0; i<n-1; i++)); do
  for ((j=0; j<n-i-1; j++)); do
    if (( \${arr[j]} > \${arr[j+1]} )); then
      temp=\${arr[j]}
      arr[j]=\${arr[j+1]}
      arr[j+1]=\$temp
    fi
  done
done
echo \${arr[@]}`,
};

const CopyCode = () => {
  const [language, setLanguage] = useState("C");
  const [code, setCode] = useState(bubbleSortExamples["C"]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(bubbleSortExamples[lang]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert("✅ Code copied to clipboard!");
  };

  return (
    <>
    <Navbar />
    <div className="max-w-5xl mx-auto my-8 shadow-lg rounded-2xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-900 px-4 py-3">
        <div className="flex items-center gap-3">
          <label className="text-gray-200 text-sm font-semibold">
            Language:
          </label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-gray-800 text-gray-100 px-3 py-1 rounded-md border border-gray-600 focus:ring focus:ring-blue-500 select select-info"
          >
            {Object.keys(bubbleSortExamples).map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleCopy}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-sm rounded-md shadow-md transition"
        >
          Copy Code
        </button>
      </div>

      {/* Code Area */}
      <textarea
        value={code}
        readOnly
        className="w-full h-[480px] p-4 font-mono text-sm bg-gray-950 text-green-300 border-0 outline-none resize-none leading-6 "
      />
    </div>
    </>
  );
};

export default CopyCode;

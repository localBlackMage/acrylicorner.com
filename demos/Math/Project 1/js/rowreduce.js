function RowAdd(matrix, toRow, fromRow, fromRowScale)
{
  for (var i in matrix[toRow])
    matrix[toRow][i] += matrix[fromRow][i] * fromRowScale;
}

function RowMultiply(matrix, row, scalar)
{
  for (var i in matrix[row])
    matrix[row][i] *= scalar;
}

// Pseudo code from http://rosettacode.org/wiki/Reduced_row_echelon_form
// matrix should be a 2D array of values
function RowReduce(matrix)
{
  var lead = 0;
  var rowCount = matrix.length;
  var colCount = matrix[0].length;

  for (var r = 0; r < rowCount; ++r)
  {
    if (colCount <= lead)
      return;

    var i = r;
    while (matrix[i][lead] == 0)
    {
      ++i;
      if (i == rowCount)
      {
        i = r;
        ++lead;
        if (colCount == lead)
          return;
      }
    }

    // Swap rows
    var tmp = matrix[i];
    matrix[i] = matrix[r];
    matrix[r] = tmp;

    if (matrix[r, lead] != 0)
      RowMultiply(matrix, r, 1 / matrix[r][lead]);

    for (var i = 0; i < rowCount; ++i)
    {
      if (i != r)
        RowAdd(matrix, i, r, -matrix[i][lead]);
    }

    ++lead;
  }
}
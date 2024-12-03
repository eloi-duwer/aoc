const std = @import("std");

const data = @embedFile("input");

var gpa = std.heap.GeneralPurposeAllocator(.{}){};
const allocator = gpa.allocator();

pub fn main() !void {
    var it = std.mem.split(u8, data, "\n");
    var sum: i32 = 0;
    while (it.next()) |line| {
        var nums = std.ArrayList(i32).init(allocator);
        defer nums.deinit();

        var it2 = std.mem.split(u8, line, " ");
        while (it2.next()) |num| {
            const a: i32 = try std.fmt.parseInt(i32, num, 10);
            try nums.append(a);
        }
        sum += if (try isSafe(nums, true)) 1 else 0;
        // std.debug.print("{any}\n", .{nums.items});
    }

    std.debug.print("{d} safe\n", .{sum});
}

fn isSafe(arr: std.ArrayList(i32), try_again: bool) std.mem.Allocator.Error!bool {
    const croissant = isCroissant(arr.items[0], arr.items[1]);
    for (0..arr.items.len - 1) |i| {
        // std.debug.print("{} {} {}\n", .{ croissant, isCroissant(arr.items[i], arr.items[i + 1]), isCroissant(arr.items[i], arr.items[i + 1]) != croissant });
        if (isCroissant(arr.items[i], arr.items[i + 1]) != croissant or
            isDiffTooBig(arr.items[i], arr.items[i + 1]))
        {
            return try tryAgainMaybe(arr, i, try_again);
        }
    }
    return true;
}

fn tryAgainMaybe(arr: std.ArrayList(i32), i: u64, try_again: bool) std.mem.Allocator.Error!bool {
    if (!try_again) {
        return false;
    }
    // std.debug.print("try again {any} {}\n", .{ arr.items, i });
    var ret: bool = false;
    if (i > 0) {
        var newArr = try arr.clone();
        _ = newArr.orderedRemove(0);
        ret = try isSafe(newArr, false);
    }
    if (!ret) {
        var newArr = try arr.clone();
        _ = newArr.orderedRemove(i);
        ret = try isSafe(newArr, false);
    }
    if (!ret) {
        var newArr = try arr.clone();
        _ = newArr.orderedRemove(i + 1);
        ret = try isSafe(newArr, false);
    }
    return ret;
}

fn isCroissant(a: i32, b: i32) bool {
    return a < b;
}

fn isDiffTooBig(a: i32, b: i32) bool {
    const diff = @abs(a - b);
    // std.debug.print("{} {} {}\n", .{ a, b, diff });
    return diff < 1 or diff > 3;
}

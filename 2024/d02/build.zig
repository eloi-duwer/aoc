const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const one = b.addExecutable(.{
        .name = "flz",
        .root_source_file = b.path("1.zig"),
        .target = target,
        .optimize = optimize,
    });

    const install_step_one = b.addInstallArtifact(one, .{});
    b.getInstallStep().dependOn(&install_step_one.step);
    const one_cmd = b.addRunArtifact(one);
    one_cmd.step.dependOn(&install_step_one.step);
    const run_one = b.step("one", "Run solution 1");
    run_one.dependOn(&one_cmd.step);

    const two = b.addExecutable(.{
        .name = "flz",
        .root_source_file = b.path("2.zig"),
        .target = target,
        .optimize = optimize,
    });

    const install_step_two = b.addInstallArtifact(two, .{});
    b.getInstallStep().dependOn(&install_step_two.step);
    const two_cmd = b.addRunArtifact(two);
    two_cmd.step.dependOn(&install_step_two.step);
    const run_two = b.step("two", "Run solution 2");
    run_two.dependOn(&two_cmd.step);
}
